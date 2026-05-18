// File: src/app/(dashboard)/users/page.tsx
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
  UserAddOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { User, UserRole } from "@/types/user";
import { userService } from "@/lib/services/user.service";
import UserModal from "./components/UserModal"; // Sẽ tạo ở Chunk 3

const { Title } = Typography;
const { Option } = Select;

export default function UsersPage() {
  const { message, modal } = AntdApp.useApp();

  // States dữ liệu
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // States phân trang & lọc
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);

  // States Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({
        page,
        limit,
        search: searchText || undefined,
        role: filterRole,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách nhân sự");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, filterRole, message]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    modal.confirm({
      title: "Vô hiệu hóa tài khoản",
      content: (
        <div>
          Bạn có chắc chắn muốn vô hiệu hóa tài khoản của{" "}
          <strong>{name}</strong>? Nhân viên này sẽ không thể đăng nhập vào hệ
          thống nữa.
        </div>
      ),
      okText: "Xác nhận xóa",
      okType: "danger",
      cancelText: "Hủy",
      destroyOnHidden: true,
      mask: { closable: false },
      onOk: async () => {
        try {
          await userService.deleteUser(id);
          message.success("Đã vô hiệu hóa tài khoản thành công");
          fetchUsers();
        } catch (error: any) {
          message.error(error.message || "Không thể xóa tài khoản này");
        }
      },
    });
  };

  const roleConfig: Record<UserRole, { color: string; label: string }> = {
    SUPER_ADMIN: { color: "volcano", label: "Quản trị cấp cao" },
    EDITOR: { color: "blue", label: "Biên tập viên" },
    SALES: { color: "green", label: "Nhân viên Sales" },
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
      title: "Nhân viên",
      key: "info",
      render: (_: any, record: User) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[#1b1c1c]">
            {record.full_name}
          </span>
          <span className="text-[12px] text-gray-500 flex items-center gap-1">
            <MailOutlined style={{ fontSize: "10px" }} /> {record.email}
          </span>
        </div>
      ),
    },
    {
      title: "Quyền hạn",
      dataIndex: "role",
      key: "role",
      width: 180,
      render: (role: UserRole) => (
        <Tag
          color={roleConfig[role]?.color}
          icon={<SafetyCertificateOutlined />}
          className="rounded-[4px] px-2"
        >
          {roleConfig[role]?.label}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date: string) => (
        <span className="text-gray-500">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center" as const,
      render: (_: any, record: User) => (
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
              onClick={() => handleDelete(record.id, record.full_name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="m-0 font-semibold tracking-tight">
            Quản lý Nhân sự
          </Title>
          <Typography.Text type="secondary">
            Phân quyền và quản lý tài khoản nhân viên trong hệ thống
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          className="bg-[#2E7D32]"
          onClick={handleAdd}
        >
          Tạo tài khoản
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setPage(1)}
            className="w-80"
            allowClear
          />
          <Select
            placeholder="Lọc theo quyền"
            className="w-48"
            allowClear
            value={filterRole}
            onChange={(val) => {
              setFilterRole(val);
              setPage(1);
            }}
          >
            <Option value="SUPER_ADMIN">Quản trị cấp cao</Option>
            <Option value="EDITOR">Biên tập viên</Option>
            <Option value="SALES">Nhân viên Sales</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              setFilterRole(undefined);
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
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            onChange: (p, s) => {
              setPage(p);
              setLimit(s);
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} tài khoản`,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* MODAL THÊM SỬA USER (Sẽ triển khai ở Chunk 3) */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchUsers();
        }}
        initialData={editingUser}
      />
    </div>
  );
}
