// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// Import thêm App từ antd và đổi tên thành AntdApp để tránh nhầm lẫn
import { ConfigProvider, App as AntdApp } from "antd";
import themeConfig from "@/theme/themeConfig";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Greentech Admin Panel",
  description: "Hệ thống quản trị nội dung Greentech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider theme={themeConfig}>
            {/* Bọc toàn bộ ứng dụng bằng AntdApp để đồng bộ Theme cho Message, Modal, Notification */}
            <AntdApp>{children}</AntdApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
