"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logoutProxy();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-3 text-gray-500 font-medium">
         <span>Bảng điều khiển CMS</span>
      </div>

      <div className="flex items-center space-x-6 text-sm font-medium">
        <div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-emerald-600 transition-colors">
          <UserCircle className="h-6 w-6" />
          <span>Admin Workspace</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-red-500 hover:text-red-700 transition-colors bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 font-semibold"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
