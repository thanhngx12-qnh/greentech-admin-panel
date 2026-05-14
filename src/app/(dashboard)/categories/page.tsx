// File: src/app/(dashboard)/categories/page.tsx
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
  Tag,
  App as AntdApp,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Category } from "@/types/category";
import { categoryService } from "@/lib/services/category.service";
import CategoryModal from "./components/CategoryModal";

const { Title } = Typography;
const { Option } = Select;

export default function CategoriesPage() {
  const { message, modal } = AntdApp.useApp();

  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // States Phân trang
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // States Bộ lọc
  const [searchText, setSearchText] = useState<string>("");
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  // States Sắp xếp (Mặc định sort theo order tăng dần)
  const [sortBy, setSortBy] = useState<string>("order");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories({
        page,
        limit,
        search: searchText || undefined,
        type: filterType,
        status: filterStatus,
        sortBy,
        order: sortOrder,
      });
      if (res.success) {
        setData(res.data);
        setTotal(res.meta.total);
      }
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    searchText,
    filterType,
    filterStatus,
    sortBy,
    sortOrder,
    message,
  ]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý sự kiện khi thay đổi trang, limit, hoặc bấm nút Sort trên cột
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 10);

    // Nếu người dùng click sort
    if (sorter && sorter.order) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === "descend" ? "desc" : "asc");
    } else {
      // Nếu bỏ sort thì trả về mặc định
      setSortBy("order");
      setSortOrder("asc");
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    modal.confirm({
      title: "Xác nhận xóa danh mục",
      content: (
        <span>
          Bạn có chắc chắn muốn xóa danh mục <strong>{name}</strong>?
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await categoryService.deleteCategory(id);
          message.success("Đã xóa danh mục thành công");
          if (data.length === 1 && page > 1) setPage(page - 1);
          else fetchCategories();
        } catch (error: any) {
          message.error(error.message || "Lỗi khi xóa");
        }
      },
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "order",
      key: "order",
      width: 100,
      align: "center" as const,
      sorter: true, // Bật tính năng sort Server-side
    },
    {
      title: "Tên danh mục (VI)",
      key: "name",
      render: (_: any, record: Category) => (
        <span className="font-medium text-[#1b1c1c]">
          {record.name_i18n?.vi || "N/A"}
        </span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: string) => {
        const colors: Record<string, string> = {
          NEWS: "blue",
          SERVICE: "green",
          STANDARD: "purple",
          JOB: "orange",
        };
        return <Tag color={colors[type] || "default"}>{type}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 120,
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? "success" : "error"}
          className="rounded-full px-3"
        >
          {isActive ? "Hoạt động" : "Tạm ẩn"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      sorter: true, // Bật tính năng sort Server-side
      render: (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return (
          <span>
            {date.toLocaleDateString("vi-VN")}{" "}
            {date.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-[#1976D2]" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(record.id, record.name_i18n?.vi || "")
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
          Quản lý Danh mục
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#2E7D32]"
          onClick={handleAdd}
        >
          Thêm danh mục
        </Button>
      </div>
      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm kiếm theo tên..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setPage(1)}
            className="w-64"
            allowClear
          />
          <Select
            placeholder="Loại"
            className="w-40"
            allowClear
            value={filterType}
            onChange={(val) => {
              setFilterType(val);
              setPage(1);
            }}
          >
            <Option value="NEWS">Tin tức</Option>
            <Option value="SERVICE">Dịch vụ</Option>
            <Option value="STANDARD">Tiêu chuẩn</Option>
            <Option value="JOB">Tuyển dụng</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            className="w-40"
            allowClear
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setPage(1);
            }}
          >
            <Option value="true">Hoạt động</Option>
            <Option value="false">Tạm ẩn</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterType(undefined);
              setFilterStatus(undefined);
              setSortBy("order");
              setSortOrder("asc");
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
          onChange={handleTableChange} // Bắt sự kiện sort & pagination
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCategories();
        }}
        initialData={editingCategory}
      />
    </div>
  );
}
