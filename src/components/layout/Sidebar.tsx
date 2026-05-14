// File: src/components/layout/Sidebar.tsx
"use client";

import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  ReadOutlined,
  TeamOutlined,
  PictureOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "accounts",
      icon: <UserOutlined />,
      label: "Tài khoản & Log",
      children: [
        { key: "/users", label: "Quản lý Users" },
        { key: "/audit-logs", label: "Lịch sử hoạt động" },
      ],
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined />,
      label: "Danh mục (Categories)",
    },
    { key: "/leads", icon: <ContactsOutlined />, label: "Khách hàng (Leads)" },
    {
      key: "content",
      icon: <ReadOutlined />,
      label: "Nội dung",
      children: [
        { key: "/news", label: "Tin tức" },
        { key: "/services", label: "Dịch vụ" },
      ],
    },
    {
      key: "/job-postings",
      icon: <TeamOutlined />,
      label: "Tuyển dụng (Jobs)",
    },
    {
      key: "/standards",
      icon: <BookOutlined />,
      label: "Tiêu chuẩn (Standards)",
    },
    { key: "/sliders", icon: <PictureOutlined />, label: "Quản lý Banners" },
    { key: "/settings", icon: <SettingOutlined />, label: "Cài đặt chung" },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      theme="dark"
      className="z-10 shadow-lg min-h-screen"
      style={{ backgroundColor: "#1A1C1E" }} // Dark charcoal
    >
      <div className="h-16 flex items-center justify-center font-bold text-lg text-white border-b border-gray-700 overflow-hidden whitespace-nowrap bg-[#1A1C1E]">
        {collapsed ? "GT" : "GREENTECH ANALYSIS"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={["accounts", "content"]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ backgroundColor: "#1A1C1E" }}
        className="mt-2 border-none"
      />
    </Sider>
  );
}
