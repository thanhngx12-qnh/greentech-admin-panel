/* File: proxy.ts */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Đổi tên hàm từ 'middleware' thành 'proxy' để khớp với yêu cầu của Next.js
export function proxy(request: NextRequest) {
  // 1. Lấy token từ HTTP-Only Cookie
  const token = request.cookies.get("access_token")?.value;

  // 2. Lấy đường dẫn hiện tại người dùng đang truy cập
  const { pathname } = request.nextUrl;

  // Định nghĩa trang login
  const isLoginPage = pathname.startsWith("/login");

  // TRƯỜNG HỢP 1: Người dùng CHƯA đăng nhập (không có token)
  if (!token && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // TRƯỜNG HỢP 2: Người dùng ĐÃ đăng nhập (có token)
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Cấu hình Matcher
export const config = {
  matcher: [
    /*
     * Áp dụng cho tất cả các đường dẫn TRỪ:
     * - api (các route API nội bộ)
     * - _next/static (file tĩnh của Next.js)
     * - _next/image (file ảnh tối ưu)
     * - favicon.ico, public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
