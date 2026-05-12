// File: app/(admin)/layout.tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner"; // Đã đổi sang dùng Sonner

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40 md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Toaster dùng cho thông báo toàn cục */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
