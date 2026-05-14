// File: src/components/layout/Header.tsx
"use client";

import React from "react";
import { Layout, Button, Dropdown, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header: AntdHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function Header({ collapsed, setCollapsed }: HeaderProps) {
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ của tôi",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: () => console.log("Logout clicked"),
    },
  ];

  return (
    <AntdHeader
      className="p-0 bg-white flex justify-between items-center pr-6 z-10 relative border-b border-[#E0E0E0]"
      style={{ height: "64px", lineHeight: "64px" }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="text-lg w-16 h-16 rounded-none hover:bg-gray-50 text-[#1b1c1c]"
      />

      <div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div className="cursor-pointer flex items-center gap-2 hover:bg-gray-50 px-3 py-1 rounded-md transition-all border border-transparent hover:border-[#E0E0E0]">
            <Avatar
              style={{ backgroundColor: "#2E7D32" }}
              icon={<UserOutlined />}
            />
            <span className="font-medium text-[#1b1c1c] text-[14px]">
              Admin
            </span>
          </div>
        </Dropdown>
      </div>
    </AntdHeader>
  );
}
