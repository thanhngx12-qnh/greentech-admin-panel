// File: components/layout/header.tsx
"use client";

import { Menu, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";

// Chỉ import những thứ thực sự cần thiết và ổn định
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function Header() {
  const router = useRouter();

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Đã đăng xuất thành công");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <Sheet>
          <SheetTrigger
            className={cn(
              "flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0 md:hidden",
              "transition-colors",
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1" />

      {/* Khu vực hành động (Action Area) - Thay thế cho Dropdown */}
      <div className="flex items-center gap-2">
        {/* Nút Cài đặt */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary transition-colors"
          onClick={() => router.push("/settings")}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Nút Đăng xuất - Màu đỏ nhẹ để cảnh báo */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </Button>

        {/* Thanh phân cách nhỏ */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* Profile Avatar - Chỉ dùng để hiển thị/link profile */}
        <button
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-muted transition-colors"
          onClick={() => router.push("/profile")}
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-none">Administrator</p>
            <p className="text-[10px] text-muted-foreground">
              admin@greentech.com
            </p>
          </div>
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              AD
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
