// File: components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Folders,
  Settings,
  Newspaper,
  FlaskConical,
  BookOpen,
  Images,
  MessageSquare,
  Briefcase,
  UserCheck,
  BarChart3,
  History,
} from "lucide-react";

// Định nghĩa toàn bộ các module đã được xây dựng ở Backend
const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  // --- NỘI DUNG (CMS) ---
  {
    title: "Danh mục",
    href: "/categories",
    icon: Folders,
  },
  {
    title: "Dịch vụ Hóa học",
    href: "/services",
    icon: FlaskConical,
  },
  {
    title: "Tin tức",
    href: "/news",
    icon: Newspaper,
  },
  {
    title: "Thư viện Tiêu chuẩn",
    href: "/standards",
    icon: BookOpen,
  },
  {
    title: "Quản lý Banner",
    href: "/sliders",
    icon: Images,
  },
  // --- KHÁCH HÀNG & NHÂN SỰ (CRM & HR) ---
  {
    title: "Khách hàng (Leads)",
    href: "/leads",
    icon: MessageSquare,
  },
  {
    title: "Tin Tuyển dụng",
    href: "/job-postings",
    icon: Briefcase,
  },
  {
    title: "Hồ sơ Ứng viên",
    href: "/job-applications",
    icon: UserCheck,
  },
  // --- THỐNG KÊ & BÁO CÁO ---
  {
    title: "Phân tích Tìm kiếm",
    href: "/search-logs",
    icon: BarChart3,
  },
  // --- HỆ THỐNG (SYSTEM) ---
  {
    title: "Quản lý Nhân sự",
    href: "/users",
    icon: Users,
  },
  {
    title: "Nhật ký Hoạt động",
    href: "/audit-logs",
    icon: History,
  },
  {
    title: "Cài đặt Hệ thống",
    href: "/global-settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 p-4">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <FlaskConical className="w-6 h-6" />
          Greentech Admin
        </h1>
      </div>

      {/* Scrollable Area (Nếu menu quá dài) */}
      <div className="overflow-y-auto h-[calc(100vh-120px)] pb-10">
        {sidebarNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
