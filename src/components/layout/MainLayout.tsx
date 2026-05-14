// File: src/components/layout/MainLayout.tsx
"use client";

import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen flex flex-row">
      <Sidebar collapsed={collapsed} />
      <Layout
        className="flex-1 overflow-hidden"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        {/* Content Box: Max 1440px width to ensure readability on ultrawide monitors */}
        <Content className="p-6 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto w-full">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
