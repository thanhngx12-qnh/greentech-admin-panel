// File: src/app/(dashboard)/audit-logs/components/AuditDetailModal.tsx
"use client";

import React from "react";
import { Modal, Button, Tag, Divider, Row, Col, Typography } from "antd";
import { AuditLog } from "@/types/audit";

const { Text, Title } = Typography;

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AuditLog | null;
}

export default function AuditDetailModal({
  isOpen,
  onClose,
  data,
}: AuditDetailModalProps) {
  if (!data) return null;

  // Helper render JSON code block
  const renderJson = (json: any) => (
    <pre className="bg-[#1A1C1E] text-green-400 p-4 rounded-[4px] overflow-auto max-h-[300px] text-[12px] font-mono">
      {json ? JSON.stringify(json, null, 2) : "// Không có dữ liệu"}
    </pre>
  );

  return (
    <Modal
      title={<span className="text-[18px]">Chi tiết thay đổi dữ liệu</span>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={1000}
      destroyOnHidden
      mask={{ closable: true }}
    >
      <div className="py-4">
        <Row gutter={16}>
          <Col span={8}>
            <Text type="secondary">Nhân viên:</Text>{" "}
            <Text strong>{data.user.full_name}</Text>
          </Col>
          <Col span={8}>
            <Text type="secondary">Module:</Text>{" "}
            <Tag color="blue">{data.module}</Tag>
          </Col>
          <Col span={8}>
            <Text type="secondary">Thời gian:</Text>{" "}
            <Text>{new Date(data.created_at).toLocaleString("vi-VN")}</Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Title level={5} className="text-[#D32F2F]">
              Dữ liệu cũ (Trước khi sửa)
            </Title>
            {renderJson(data.old_data)}
          </Col>
          <Col span={12}>
            <Title level={5} className="text-[#2E7D32]">
              Dữ liệu mới (Sau khi sửa)
            </Title>
            {renderJson(data.new_data)}
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
