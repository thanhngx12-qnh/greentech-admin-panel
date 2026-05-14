// File: src/app/(dashboard)/standards/page.tsx
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
  FilePdfOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { StandardAdmin } from "@/types/standard";
import { Category } from "@/types/category";
import { standardService } from "@/lib/services/standard.service";
import { categoryService } from "@/lib/services/category.service";

const { Title } = Typography;
const { Option } = Select;

export default function StandardsPage() {
  const router = useRouter();
  const { message, modal } = AntdApp.useApp();

  const [data, setData] = useState<StandardAdmin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // States Phân trang & Sắp xếp
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // States Bộ lọc
  const [searchText, setSearchText] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>(
    undefined,
  );

  // Lấy danh mục STANDARD cho bộ lọc
  useEffect(() => {
    (async () => {
      try {
        const res = await categoryService.getCategories({
          type: "STANDARD",
          limit: 100,
        });
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error("Lỗi tải danh mục");
      }
    })();
  }, []);

  const fetchStandards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await standardService.getStandards({
        page,
        limit,
        search: searchText || undefined,
        category_id: filterCategoryId,
        // ĐÃ GỠ BỎ sortBy và order để tránh lỗi Backend
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterCategoryId, message]);

  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 20);
    if (sorter && sorter.order) {
      setSortBy(sorter.field === "title" ? "title_vi" : sorter.field);
      setSortOrder(sorter.order === "descend" ? "desc" : "asc");
    } else {
      setSortBy("created_at");
      setSortOrder("desc");
    }
  };

  const handleDelete = (id: string, code: string) => {
    modal.confirm({
      title: "Xác nhận xóa Tiêu chuẩn",
      content: (
        <span>
          Bạn có chắc chắn muốn xóa tiêu chuẩn <strong>{code}</strong>?
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      destroyOnHidden: true,
      mask: { closable: false },
      onOk: async () => {
        try {
          await standardService.deleteStandard(id);
          message.success("Đã xóa tiêu chuẩn thành công");
          fetchStandards();
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
      title: "Mã Tiêu chuẩn",
      dataIndex: "code",
      key: "code",
      width: 200,
      sorter: true,
      render: (code: string) => (
        <span className="font-bold text-[#1b1c1c]">{code}</span>
      ),
    },
    {
      title: "Tên Tiêu chuẩn (VI)",
      key: "title",
      sorter: true,
      render: (_: any, record: StandardAdmin) => (
        <span className="text-[#1b1c1c] font-medium">
          {record.title_i18n?.vi || "N/A"}
        </span>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      width: 180,
      render: (_: any, record: StandardAdmin) => (
        <Tag color="blue" className="rounded-[4px]">
          {record.category?.name_i18n?.vi || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Tài liệu",
      dataIndex: "file_url",
      key: "file_url",
      width: 100,
      align: "center" as const,
      render: (url: string) =>
        url ? (
          <Tooltip title="Xem tài liệu PDF">
            <Button
              type="text"
              icon={<FilePdfOutlined className="text-red-600 text-lg" />}
              onClick={() => window.open(url, "_blank")}
            />
          </Tooltip>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      sorter: true,
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
      render: (_: any, record: StandardAdmin) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-[#1976D2]" />}
              onClick={() => router.push(`/standards/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.code)}
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
          Thư viện Tiêu chuẩn & Quy chuẩn
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#2E7D32]"
          onClick={() => router.push("/standards/create")}
        >
          Thêm Tiêu chuẩn
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo Mã hoặc Tên..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setPage(1)}
            className="w-80"
            allowClear
          />
          <Select
            placeholder="Lọc theo danh mục"
            className="w-64"
            allowClear
            value={filterCategoryId}
            onChange={(val) => {
              setFilterCategoryId(val);
              setPage(1);
            }}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name_i18n.vi}
              </Option>
            ))}
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterCategoryId(undefined);
              setPage(1);
            }}
          >
            Làm mới
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
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
