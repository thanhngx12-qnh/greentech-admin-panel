// File: src/components/layout/MainLayout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  // FIX HYDRATION TOÀN CỤC:
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Nếu chưa mounted, render một khung rỗng để tránh mismatch HTML
  if (!mounted) {
    return <div style={{ background: "#F5F7FA", minHeight: "100vh" }} />;
  }

  return (
    <Layout className="min-h-screen flex flex-row" suppressHydrationWarning>
      <Sidebar collapsed={collapsed} />
      <Layout
        className="flex-1 overflow-hidden"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="p-6 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto w-full">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
