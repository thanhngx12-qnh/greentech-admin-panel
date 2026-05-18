// File: src/app/(dashboard)/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  App as AntdApp,
  Spin,
  Space,
  Avatar,
} from "antd";
import {
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  RiseOutlined,
  InboxOutlined,
  CarryOutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/plots";
import { dashboardService } from "@/lib/services/dashboard.service";
import {
  DashboardStats,
  LeadGrowthData,
  SearchKeyword,
  RecentActivity,
} from "@/types/dashboard";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<LeadGrowthData[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<SearchKeyword[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Sử dụng cơ chế bọc từng request để tìm lỗi cụ thể
      const safeFetch = async (
        promise: Promise<any>,
        setter: (d: any) => void,
        debugName: string,
      ) => {
        try {
          const res = await promise;
          if (res.success) setter(res.data);
        } catch (err: any) {
          console.error(`[Dashboard Debug] Lỗi tại API: ${debugName}`, err);
          // Không dùng message.error ở đây để tránh hiện quá nhiều thông báo cùng lúc
        }
      };

      await Promise.all([
        safeFetch(dashboardService.getStats(), setStats, "Stats"),
        safeFetch(
          dashboardService.getLeadGrowth(),
          setGrowthData,
          "Lead Growth",
        ),
        safeFetch(dashboardService.getTopKeywords(), setKeywords, "Keywords"),
        safeFetch(
          dashboardService.getRecentActivities(),
          setActivities,
          "Recent Activities",
        ),
        safeFetch(
          dashboardService.getLeadFunnel(),
          (data) => {
            const transformed = [
              { type: "Mới", value: data.NEW || 0 },
              { type: "Đã liên hệ", value: data.CONTACTED || 0 },
              { type: "Tiềm năng", value: data.QUALIFIED || 0 },
              { type: "Thành công", value: data.CLOSED || 0 },
            ];
            setFunnelData(transformed);
          },
          "Lead Funnel",
        ),
      ]);

      setLoading(false);
    };

    fetchData();
  }, []); // Xóa message khỏi deps để tránh loop không cần thiết

  // --- Cấu hình Charts (Chỉ render khi có data) ---
  const lineConfig = {
    data: growthData,
    xField: "date",
    yField: "count",
    smooth: true,
    colorField: "#2E7D32",
    interaction: { tooltip: true },
  };

  const pieConfig = {
    data: funnelData,
    angleField: "value",
    colorField: "type",
    radius: 0.7,
    innerRadius: 0.4,
    label: { text: "value", style: { fontWeight: "bold" } },
    legend: {
      color: { position: "bottom", layout: { justifyContent: "center" } },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spin size="large" description="Hệ thống đang tổng hợp dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <Title level={2} className="m-0 font-semibold tracking-tight">
          Tổng quan hệ thống
        </Title>
        <Tag color="blue">
          Dữ liệu cập nhật: {new Date().toLocaleTimeString()}
        </Tag>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
            <Statistic
              title="Khách hàng mới"
              value={stats?.leads.total || 0}
              styles={{ content: { color: "#2E7D32", fontWeight: "700" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
            <Statistic
              title="Hồ sơ ứng tuyển"
              value={stats?.careers.applications || 0}
              styles={{ content: { color: "#1976D2", fontWeight: "700" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
            <Statistic
              title="Bài viết & Dịch vụ"
              value={
                (stats?.content.news || 0) + (stats?.content.services || 0)
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="border-[#E0E0E0] shadow-none">
            <Statistic title="Nhân sự" value={stats?.system.users || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            variant="outlined"
            title="Tăng trưởng Leads"
            className="border-[#E0E0E0] shadow-none"
          >
            <div className="h-[300px]">
              {growthData.length > 0 ? (
                <Line {...lineConfig} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Không có dữ liệu tăng trưởng
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            variant="outlined"
            title="Phễu khách hàng"
            className="border-[#E0E0E0] shadow-none"
          >
            <div className="h-[300px]">
              {funnelData.some((d) => d.value > 0) ? (
                <Pie {...pieConfig} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Không có dữ liệu phễu
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            variant="outlined"
            title="Top từ khóa tìm kiếm"
            className="border-[#E0E0E0] shadow-none"
          >
            <Table
              dataSource={keywords}
              rowKey="keyword"
              pagination={false}
              size="small"
              columns={[
                { title: "Từ khóa", dataIndex: "keyword", key: "keyword" },
                {
                  title: "Lượt tìm",
                  dataIndex: "count",
                  key: "count",
                  align: "right",
                  render: (v) => <Tag color="blue">{v}</Tag>,
                },
              ]}
              locale={{ emptyText: "Chưa có dữ liệu tìm kiếm" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            variant="outlined"
            title="Hoạt động nội dung mới"
            className="border-[#E0E0E0] shadow-none"
          >
            <div className="space-y-4">
              {activities && activities.length > 0 ? (
                activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 border-b border-gray-50 last:border-0"
                  >
                    <Avatar
                      icon={
                        item.type === "NEWS" ? (
                          <FileTextOutlined />
                        ) : (
                          <ShoppingCartOutlined />
                        )
                      }
                      className={
                        item.type === "NEWS" ? "bg-blue-500" : "bg-green-500"
                      }
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[14px]">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-gray-400">
                        {item.type} •{" "}
                        {new Date(item.updated_at).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <Tag color="success" className="mr-0">
                      {item.status}
                    </Tag>
                  </div>
                ))
              ) : (
                /* Hiển thị khi API lỗi hoặc không có dữ liệu */
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <InboxOutlined
                    style={{ fontSize: "32px", marginBottom: "8px" }}
                  />
                  <span>Không có dữ liệu hoạt động mới</span>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
