// File: src/app/(dashboard)/sliders/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Select,
  App as AntdApp,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { SliderAdmin, SliderPosition } from "@/types/slider";
import { sliderService } from "@/lib/services/slider.service";
import SliderModal from "./components/SliderModal"; // Import Modal đã tạo

const { Title } = Typography;
const { Option } = Select;

export default function SlidersPage() {
  const { message, modal } = AntdApp.useApp();

  const [data, setData] = useState<SliderAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterPosition, setFilterPosition] = useState<string | undefined>(
    undefined,
  );
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  // States quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderAdmin | null>(null);

  const fetchSliders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sliderService.getSliders({
        page,
        limit,
        position: filterPosition,
        status: filterStatus,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách banner");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterPosition, filterStatus, message]);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 10);
  };

  const handleAdd = () => {
    setEditingSlider(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: SliderAdmin) => {
    setEditingSlider(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    modal.confirm({
      title: "Xác nhận xóa Banner",
      content: (
        <span>
          Bạn có chắc chắn muốn xóa banner <strong>{name}</strong>?
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      destroyOnHidden: true,
      mask: { closable: false },
      onOk: async () => {
        try {
          await sliderService.deleteSlider(id);
          message.success("Đã xóa banner thành công");
          fetchSliders();
        } catch (error: any) {
          message.error(error.message || "Lỗi khi xóa banner");
        }
      },
    });
  };

  const positionConfig: Record<
    SliderPosition,
    { color: string; label: string }
  > = {
    HOME_TOP: { color: "blue", label: "Trang chủ - Đầu" },
    HOME_MIDDLE: { color: "cyan", label: "Trang chủ - Giữa" },
    SERVICES_TOP: { color: "green", label: "Dịch vụ - Đầu" },
    NEWS_TOP: { color: "orange", label: "Tin tức - Đầu" },
    CONTACT_TOP: { color: "purple", label: "Liên hệ - Đầu" },
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
      title: "Tên định danh",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-medium text-[#1b1c1c]">{name}</span>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      width: 180,
      render: (pos: SliderPosition) => (
        <Tag color={positionConfig[pos]?.color} className="rounded-[4px]">
          {positionConfig[pos]?.label}
        </Tag>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "order",
      key: "order",
      width: 100,
      align: "center" as const,
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
          {isActive ? "Đang chạy" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center" as const,
      render: (_: any, record: SliderAdmin) => (
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
              onClick={() => handleDelete(record.id, record.name)}
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
          Quản lý Banner (Sliders)
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#2E7D32]"
          onClick={handleAdd}
        >
          Thêm Banner
        </Button>
      </div>

      <Card variant="outlined" className="border-[#E0E0E0] shadow-none mb-6">
        <Space wrap size="middle">
          <Select
            placeholder="Lọc theo vị trí"
            className="w-64"
            allowClear
            value={filterPosition}
            onChange={(val) => {
              setFilterPosition(val);
              setPage(1);
            }}
          >
            {Object.entries(positionConfig).map(([key, config]) => (
              <Option key={key} value={key}>
                {config.label}
              </Option>
            ))}
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
            <Option value="true">Đang chạy</Option>
            <Option value="false">Tạm dừng</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setFilterPosition(undefined);
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
            showTotal: (total) => `Tổng số ${total} banner`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* MODAL THÊM SỬA BANNER */}
      <SliderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // QUAN TRỌNG: Đóng modal và load lại data khi thành công
          setIsModalOpen(false);
          fetchSliders();
        }}
        initialData={editingSlider}
      />
    </div>
  );
}
