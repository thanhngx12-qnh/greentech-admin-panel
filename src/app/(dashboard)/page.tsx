// File: src/app/(dashboard)/page.tsx
"use client";

import React from "react";
import { Typography, Row, Col, Card, Statistic } from "antd";
import { ArrowUpOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <div>
      <Title
        level={2}
        className="mb-6 text-[#1b1c1c] font-semibold tracking-tight"
      >
        Tổng quan hệ thống
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={6}>
          {/* Surface Level 1: Dùng variant="outlined" thay cho bordered */}
          <Card
            variant="outlined"
            className="border-[#E0E0E0] rounded-[4px] shadow-none"
          >
            <Statistic
              title={
                <span className="text-[14px] font-medium text-[#40493d]">
                  Khách hàng tiềm năng (Leads)
                </span>
              }
              value={11.28}
              precision={2}
              // Dùng styles.content thay cho valueStyle
              styles={{ content: { color: "#2E7D32", fontWeight: "600" } }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card
            variant="outlined"
            className="border-[#E0E0E0] rounded-[4px] shadow-none"
          >
            <Statistic
              title={
                <span className="text-[14px] font-medium text-[#40493d]">
                  Truy cập / Tìm kiếm
                </span>
              }
              value={93}
              styles={{ content: { color: "#1976D2", fontWeight: "600" } }} // Secondary Blue
              prefix={<UserOutlined />}
              suffix="lượt"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
