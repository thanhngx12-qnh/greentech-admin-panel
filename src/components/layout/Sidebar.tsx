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
  SolutionOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định Key nào nên được mở mặc định dựa trên pathname
  const getDefaultOpenKeys = () => {
    if (pathname.includes("/users") || pathname.includes("/audit-logs"))
      return ["accounts"];
    if (pathname.includes("/news") || pathname.includes("/services"))
      return ["content"];
    if (
      pathname.includes("/job-postings") ||
      pathname.includes("/job-applications")
    )
      return ["careers"];
    return [];
  };

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
      key: "careers",
      icon: <TeamOutlined />,
      label: "Tuyển dụng",
      children: [
        { key: "/job-postings", label: "Tin tuyển dụng" },
        { key: "/job-applications", label: "Hồ sơ ứng viên (CVs)" },
      ],
    },
    {
      key: "/standards",
      icon: <BookOutlined />,
      label: "Tiêu chuẩn (Standards)",
    },
    { key: "/sliders", icon: <PictureOutlined />, label: "Quản lý Banners" },
    { key: "/settings", icon: <SettingOutlined />, label: "Cài đặt chung" },
  ];

  // Hàm xử lý việc xác định selected key cho cả các trang con (create/edit)
  const getSelectedKey = () => {
    if (pathname.startsWith("/news")) return "/news";
    if (pathname.startsWith("/services")) return "/services";
    if (pathname.startsWith("/job-postings")) return "/job-postings";
    if (pathname.startsWith("/job-applications")) return "/job-applications";
    return pathname;
  };

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
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={getDefaultOpenKeys()}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ backgroundColor: "#1A1C1E" }}
        className="mt-2 border-none"
      />
    </Sider>
  );
}
