// File: src/app/(dashboard)/news/page.tsx
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
import { NewsAdmin, NewsStatus } from "@/types/news";
import { newsService } from "@/lib/services/news.service";

const { Title } = Typography;
const { Option } = Select;

export default function NewsPage() {
  const router = useRouter();
  const { message, modal } = AntdApp.useApp();

  // States quản lý dữ liệu
  const [data, setData] = useState<NewsAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // States phân trang & bộ lọc
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  // Lấy danh sách Bài viết
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsService.getNewsList({
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
      message.error(error.message || "Lỗi khi tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterStatus, message]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Xử lý thay đổi phân trang
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 10);
  };

  // Xử lý Xóa bài viết
  const handleDelete = (id: string, title: string) => {
    modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: (
        <span>
          Bạn có chắc chắn muốn xóa bài viết <strong>{title}</strong>? Hành động
          này không thể hoàn tác.
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await newsService.deleteNews(id);
          message.success("Đã xóa bài viết thành công");
          if (data.length === 1 && page > 1) setPage(page - 1);
          else fetchNews();
        } catch (error: any) {
          message.error(error.message || "Lỗi khi xóa bài viết");
        }
      },
    });
  };

  // Cấu hình UI cho các Trạng thái
  const statusConfig: Record<NewsStatus, { color: string; label: string }> = {
    DRAFT: { color: "default", label: "Bản nháp" },
    PUBLISHED: { color: "success", label: "Đã xuất bản" },
    UNPUBLISHED: { color: "warning", label: "Đã gỡ xuống" },
    SCHEDULED: { color: "processing", label: "Đã lên lịch" },
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
      title: "Tiêu đề bài viết (VI)",
      key: "title",
      render: (_: any, record: NewsAdmin) => (
        <span className="font-medium text-[#1b1c1c] text-[15px]">
          {record.title_i18n?.vi || "N/A"}
        </span>
      ),
    },
    {
      title: "Tác giả",
      key: "author",
      width: 180,
      render: (_: any, record: NewsAdmin) => (
        <span className="text-gray-600">
          {record.author?.full_name || "Admin"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: NewsStatus) => (
        <Tag
          color={statusConfig[status]?.color || "default"}
          className="rounded-full px-3"
        >
          {statusConfig[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
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
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: NewsAdmin) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-[#1976D2]" />}
              onClick={() => router.push(`/news/${record.id}`)}
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
          Quản lý Tin tức
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#2E7D32]"
          onClick={() => router.push("/news/create")}
        >
          Thêm bài viết
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm kiếm tiêu đề..."
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
            showTotal: (total) => `Tổng số ${total} bài viết`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
