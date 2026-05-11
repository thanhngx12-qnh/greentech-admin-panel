"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Newspaper, Settings, Users,
  FolderTree, Target, Megaphone, FolderKanban, ShieldAlert,
  Search, Briefcase, FileSignature, Menu, FileCheck2
} from "lucide-react";

// Dựa chính xác vào cụm API từ openapi.json
const navigation =[
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Danh mục CMS', href: '/categories', icon: FolderTree },
  { name: 'Quản lý Tin tức', href: '/news', icon: Newspaper },
  { name: 'Quản lý Dịch vụ', href: '/services', icon: FolderKanban },
  { name: 'Quản lý Tiêu chuẩn', href: '/standards', icon: FileCheck2 },
  { name: 'Khách hàng (Leads)', href: '/leads', icon: Target },
  { name: 'Đăng Tuyển dụng', href: '/job-postings', icon: Megaphone },
  { name: 'Hồ sơ Ứng viên', href: '/job-applications', icon: Briefcase },
  { name: 'Quản lý Banner', href: '/sliders', icon: FileSignature },
  { name: 'Logs Tìm kiếm', href: '/search-logs', icon: Search },
  { name: 'Giám sát Audit Logs', href: '/audit-logs', icon: ShieldAlert },
  { name: 'Nhân sự / Users', href: '/users', icon: Users },
  { name: 'Cài đặt Global', href: '/global-settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 text-white shadow-xl transition-all duration-300">
      {/* Brand logo / Tiêu đề */}
      <div className="flex h-16 items-center justify-center px-4 py-4 bg-slate-950 border-b border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">Greentech B2B</h1>
      </div>
      
      {/* Scroll Menu Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-800 text-emerald-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"
                }`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800 p-4 text-xs text-slate-400 text-center font-medium bg-slate-950">
        © 2026 Greentech CMS v1.0
      </div>
    </div>
  );
}
