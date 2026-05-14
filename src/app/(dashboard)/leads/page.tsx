// File: src/app/(dashboard)/leads/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  App as AntdApp,
  Tag,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Lead, LeadStatus } from "@/types/lead";
import { leadService } from "@/lib/services/lead.service";

const { Title } = Typography;
const { Option } = Select;

export default function LeadsPage() {
  const { message } = AntdApp.useApp();

  // States quản lý dữ liệu
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // States phân trang & bộ lọc
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  // Lấy danh sách Leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads({
        page,
        limit,
        search: searchText || undefined,
        status: filterStatus,
      });
      if (res.success) {
        setData(res.data);
        setTotal(res.meta.total);
      }
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterStatus, message]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Xử lý thay đổi phân trang
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 20);
  };

  // Cập nhật trạng thái trực tiếp trên bảng (Optimistic Update)
  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    // 1. Cập nhật UI ngay lập tức để tạo cảm giác mượt mà (Optimistic UI)
    setData((prevData) =>
      prevData.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead,
      ),
    );

    // 2. Gọi API ngầm định
    try {
      await leadService.updateStatus(id, newStatus);
      message.success("Đã cập nhật trạng thái khách hàng");
    } catch (error: any) {
      message.error(error.message || "Lỗi khi cập nhật trạng thái");
      fetchLeads(); // Hoàn tác lại data cũ nếu API lỗi
    }
  };

  // Xử lý xuất file CSV
  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Chỉ truyền status đang filter để xuất báo cáo
      await leadService.exportLeads({ status: filterStatus });
      message.success("Xuất file báo cáo thành công");
    } catch (error: any) {
      message.error("Có lỗi xảy ra khi xuất báo cáo");
    } finally {
      setExportLoading(false);
    }
  };

  // Màu sắc cho từng Trạng thái
  const statusConfig: Record<LeadStatus, { color: string; label: string }> = {
    NEW: { color: "blue", label: "Mới" },
    CONTACTED: { color: "orange", label: "Đã liên hệ" },
    QUALIFIED: { color: "green", label: "Tiềm năng" },
    CLOSED: { color: "default", label: "Đóng/Hoàn thành" },
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: "Thông tin khách hàng",
      key: "info",
      render: (_: any, record: Lead) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[#1b1c1c]">
            {record.full_name}
          </span>
          <span className="text-[13px] text-gray-500 flex items-center gap-2">
            <MailOutlined /> {record.email}
          </span>
          {record.phone && (
            <span className="text-[13px] text-gray-500 flex items-center gap-2">
              <PhoneOutlined /> {record.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Công ty",
      dataIndex: "company_name",
      key: "company_name",
      width: 200,
      render: (company: string) =>
        company ? (
          <span className="text-[#40493d] flex items-center gap-2">
            <BankOutlined className="text-gray-400" /> {company}
          </span>
        ) : (
          <span className="text-gray-400 italic">Cá nhân</span>
        ),
    },
    {
      title: "Ngày gửi Form",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return (
          <span className="text-[#1b1c1c]">
            {date.toLocaleDateString("vi-VN")}{" "}
            <span className="text-gray-500 text-[12px]">
              {date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
        );
      },
    },
    {
      title: "Trạng thái (Sales Update)",
      key: "status",
      width: 180,
      render: (_: any, record: Lead) => (
        <Select
          value={record.status}
          onChange={(val: LeadStatus) => handleStatusChange(record.id, val)}
          className="w-full"
          options={[
            {
              value: "NEW",
              label: (
                <Tag color={statusConfig.NEW.color}>
                  {statusConfig.NEW.label}
                </Tag>
              ),
            },
            {
              value: "CONTACTED",
              label: (
                <Tag color={statusConfig.CONTACTED.color}>
                  {statusConfig.CONTACTED.label}
                </Tag>
              ),
            },
            {
              value: "QUALIFIED",
              label: (
                <Tag color={statusConfig.QUALIFIED.color}>
                  {statusConfig.QUALIFIED.label}
                </Tag>
              ),
            },
            {
              value: "CLOSED",
              label: (
                <Tag color={statusConfig.CLOSED.color}>
                  {statusConfig.CLOSED.label}
                </Tag>
              ),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title
          level={2}
          className="m-0 text-[#1b1c1c] font-semibold tracking-tight"
        >
          Khách hàng tiềm năng (Leads)
        </Title>
        <Button
          type="default"
          icon={<ExportOutlined />}
          loading={exportLoading}
          onClick={handleExport}
          className="border-[#1976D2] text-[#1976D2] hover:bg-blue-50"
        >
          Xuất báo cáo CSV
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo tên, email, công ty..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setPage(1)}
            className="w-72"
            allowClear
          />
          <Select
            placeholder="Lọc theo trạng thái"
            className="w-48"
            allowClear
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setPage(1);
            }}
          >
            <Option value="NEW">Mới</Option>
            <Option value="CONTACTED">Đã liên hệ</Option>
            <Option value="QUALIFIED">Tiềm năng</Option>
            <Option value="CLOSED">Đóng/Hoàn thành</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterStatus(undefined);
              setPage(1);
            }}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </Card>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Tổng số ${total} khách hàng`,
          }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
