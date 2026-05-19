// File: src/app/(dashboard)/audit-logs/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Table,
  Button,
  Select,
  Space,
  App as AntdApp,
  Tag,
  Tooltip,
} from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { AuditLog, AuditAction, AuditModule } from "@/types/audit";
import { auditService } from "@/lib/services/audit.service";
import AuditDetailModal from "./components/AuditDetailModal";

const { Title } = Typography;
const { Option } = Select;

export default function AuditLogsPage() {
  const { message } = AntdApp.useApp();

  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Filters
  const [filterModule, setFilterModule] = useState<string | undefined>(
    undefined,
  );
  const [filterAction, setFilterAction] = useState<string | undefined>(
    undefined,
  );

  // Modal detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditService.getLogs({
        page,
        limit,
        module: filterModule,
        action: filterAction,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error: any) {
      message.error("Lỗi khi tải lịch sử hệ thống");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterModule, filterAction, message]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const actionConfig: Record<AuditAction, { color: string; label: string }> = {
    CREATE: { color: "green", label: "TẠO MỚI" },
    UPDATE: { color: "blue", label: "CẬP NHẬT" },
    DELETE: { color: "volcano", label: "XÓA" },
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
      key: "user",
      width: 220,
      render: (_: any, record: AuditLog) => (
        <div className="flex flex-col">
          <span className="font-semibold">{record.user.full_name}</span>
          <span className="text-[12px] text-gray-500">{record.user.email}</span>
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 140,
      render: (action: AuditAction) => (
        <Tag color={actionConfig[action]?.color} className="font-bold">
          {actionConfig[action]?.label}
        </Tag>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 150,
      render: (mod: string) => <Tag color="default">{mod}</Tag>,
    },
    {
      title: "ID Bản ghi",
      dataIndex: "record_id",
      key: "record_id",
      className: "text-[12px] font-mono text-gray-400",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN")}{" "}
          {new Date(date).toLocaleTimeString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Chi tiết",
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: AuditLog) => (
        <Tooltip title="Xem thay đổi dữ liệu">
          <Button
            type="text"
            icon={<EyeOutlined className="text-[#1976D2]" />}
            onClick={() => {
              setSelectedLog(record);
              setIsModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title
            level={2}
            className="m-0 font-semibold tracking-tight flex items-center gap-2"
          >
            <HistoryOutlined /> Lịch sử Hoạt động
          </Title>
          <Typography.Text type="secondary">
            Theo dõi các thay đổi dữ liệu quan trọng của hệ thống
          </Typography.Text>
        </div>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <FilterOutlined className="text-gray-400" />
          <Select
            placeholder="Lọc theo Module"
            className="w-48"
            allowClear
            value={filterModule}
            onChange={(val) => {
              setFilterModule(val);
              setPage(1);
            }}
          >
            {[
              "NEWS",
              "SERVICES",
              "JOB_POSTINGS",
              "CATEGORIES",
              "LEADS",
              "SLIDERS",
              "USERS",
              "SETTINGS",
            ].map((m) => (
              <Option key={m} value={m}>
                {m}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Loại hành động"
            className="w-40"
            allowClear
            value={filterAction}
            onChange={(val) => {
              setFilterAction(val);
              setPage(1);
            }}
          >
            <Option value="CREATE">Tạo mới</Option>
            <Option value="UPDATE">Cập nhật</Option>
            <Option value="DELETE">Xóa</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setFilterModule(undefined);
              setFilterAction(undefined);
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
            showTotal: (total) => `Tổng số ${total} bản ghi log`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <AuditDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedLog}
      />
    </div>
  );
}
