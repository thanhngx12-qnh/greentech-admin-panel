// File: src/app/(dashboard)/services/page.tsx
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
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ServiceAdmin, ServiceStatus } from "@/types/service";
import { serviceService } from "@/lib/services/service.service";

const { Title } = Typography;
const { Option } = Select;

export default function ServicesPage() {
  const router = useRouter();
  const { message, modal } = AntdApp.useApp();

  const [data, setData] = useState<ServiceAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // States Phân trang & Sắp xếp
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // States Bộ lọc
  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await serviceService.getServices({
        page,
        limit,
        search: searchText || undefined,
        status: filterStatus,
        sortBy,
        order: sortOrder,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterStatus, sortBy, sortOrder, message]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 10);

    if (sorter && sorter.order) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === "descend" ? "desc" : "asc");
    } else {
      setSortBy("created_at");
      setSortOrder("desc");
    }
  };

  const handleDelete = (id: string, title: string) => {
    modal.confirm({
      title: "Xác nhận xóa dịch vụ",
      content: (
        <span>
          Bạn có chắc chắn muốn xóa dịch vụ <strong>{title}</strong>?
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await serviceService.deleteService(id);
          message.success("Đã xóa dịch vụ thành công");
          fetchServices();
        } catch (error: any) {
          message.error(error.message || "Lỗi khi xóa dịch vụ");
        }
      },
    });
  };

  const statusConfig: Record<ServiceStatus, { color: string; label: string }> =
    {
      DRAFT: { color: "default", label: "Bản nháp" },
      PUBLISHED: { color: "success", label: "Đã xuất bản" },
      UNPUBLISHED: { color: "warning", label: "Đã gỡ xuống" },
    };

  const columns = [
    {
      title: "Tên dịch vụ (VI)",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (_: any, record: ServiceAdmin) => (
        <span className="font-medium text-[#1b1c1c]">
          {record.title_i18n?.vi || "N/A"}
        </span>
      ),
    },
    {
      title: "Giá dịch vụ",
      dataIndex: "price",
      key: "price",
      width: 180,
      sorter: true,
      render: (price: number, record: ServiceAdmin) => (
        <span className="text-[#2E7D32] font-semibold">
          {price ? price.toLocaleString("vi-VN") : "Liên hệ"}{" "}
          {price ? record.currency : ""}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: ServiceStatus) => (
        <Tag color={statusConfig[status]?.color} className="rounded-full px-3">
          {statusConfig[status]?.label}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      sorter: true,
      render: (dateString: string) => {
        const date = new Date(dateString);
        return (
          <span className="text-gray-600">
            {date.toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center" as const,
      render: (_: any, record: ServiceAdmin) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-[#1976D2]" />}
              onClick={() => router.push(`/services/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(record.id, record.title_i18n?.vi || "")
              }
            />
          </Tooltip>
        </Space>
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
          Quản lý Dịch vụ
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#2E7D32]"
          onClick={() => router.push("/services/create")}
        >
          Thêm dịch vụ
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm tên dịch vụ..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setPage(1)}
            className="w-72"
            allowClear
          />
          <Select
            placeholder="Trạng thái"
            className="w-48"
            allowClear
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setPage(1);
            }}
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <Option key={key} value={key}>
                {config.label}
              </Option>
            ))}
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterStatus(undefined);
              setSortBy("created_at");
              setSortOrder("desc");
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
            showTotal: (total) => `Tổng số ${total} dịch vụ`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
