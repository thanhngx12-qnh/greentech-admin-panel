// File: src/app/(dashboard)/job-postings/page.tsx
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
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { careerService } from "@/lib/services/career.service";
import { JobPosting, JobStatus, JobType } from "@/types/career";

const { Title } = Typography;
const { Option } = Select;

export default function JobPostingsPage() {
  const router = useRouter();
  const { message, modal } = AntdApp.useApp();

  const [data, setData] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // States Phân trang & Sắp xếp
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // States Bộ lọc
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      // FIX TẠI ĐÂY: Thêm `: any` để loại bỏ lỗi ép kiểu của Axios
      const res: any = await careerService.getJobs({
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
      message.error(error.message || "Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterStatus, sortBy, sortOrder, message]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Xử lý khi thay đổi trang, limit hoặc click Sort trên tiêu đề cột
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 10);

    if (sorter && sorter.order) {
      setSortBy(sorter.field === "title" ? "title_vi" : sorter.field);
      setSortOrder(sorter.order === "descend" ? "desc" : "asc");
    } else {
      setSortBy("created_at");
      setSortOrder("desc");
    }
  };

  const handleDelete = (id: string, title: string) => {
    modal.confirm({
      title: "Xác nhận xóa tin tuyển dụng",
      content: (
        <span>
          Bạn có chắc chắn muốn xóa vị trí <strong>{title}</strong>?
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      destroyOnHidden: true,
      mask: { closable: false },
      onOk: async () => {
        try {
          await careerService.deleteJob(id);
          message.success("Đã xóa tin tuyển dụng");
          fetchJobs();
        } catch (error: any) {
          message.error(error.message || "Lỗi khi xóa");
        }
      },
    });
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: "Vị trí tuyển dụng",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (_: any, record: JobPosting) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[#1b1c1c]">
            {record.title_i18n?.vi}
          </span>
          <span className="text-[12px] text-gray-500">{record.location}</span>
        </div>
      ),
    },
    {
      title: "Hình thức",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: JobType) => <Tag className="rounded-full">{type}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: JobStatus) => (
        <Tag
          color={
            status === "OPEN"
              ? "success"
              : status === "DRAFT"
                ? "default"
                : "error"
          }
          className="rounded-full px-3"
        >
          {status === "OPEN"
            ? "Đang tuyển"
            : status === "DRAFT"
              ? "Bản nháp"
              : "Đã đóng"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      sorter: true,
      defaultSortOrder: "descend" as const,
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center" as const,
      render: (_: any, record: JobPosting) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-[#1976D2]" />}
              onClick={() => router.push(`/job-postings/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.title_i18n?.vi)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0 font-semibold tracking-tight">
          Quản lý Tin tuyển dụng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#2E7D32]"
          onClick={() => router.push("/job-postings/create")}
        >
          Đăng tin mới
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm kiếm vị trí..."
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
            <Option value="OPEN">Đang tuyển</Option>
            <Option value="CLOSED">Đã đóng</Option>
            <Option value="DRAFT">Bản nháp</Option>
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
            Xóa bộ lọc & Sắp xếp
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
            showTotal: (total) => `Tổng số ${total} bản ghi`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
