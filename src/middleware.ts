// File: src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // 1. TÍNH NĂNG BFF PROXY & INTERCEPTOR (Gắn Token vào API)
  if (pathname.startsWith("/api-backend/")) {
    const requestHeaders = new Headers(request.headers);
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    // Định tuyến lại về Backend thật (Bỏ chữ /api-backend)
    const targetPath = pathname.replace("/api-backend", "");
    const targetUrl = new URL(
      targetPath + request.nextUrl.search,
      "http://localhost:3000",
    );

    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. TÍNH NĂNG BẢO VỆ ROUTE QUẢN TRỊ (Protected Routes)
  const isAuthPage = pathname.startsWith("/login");
  const isInternalApi =
    pathname.startsWith("/api/") || pathname.startsWith("/_next/");

  if (!isAuthPage && !isInternalApi) {
    if (!token) {
      // Chưa đăng nhập -> đá về trang /login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Đã đăng nhập mà cố tình vào /login -> đẩy về trang chủ Dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Áp dụng middleware cho mọi route ngoại trừ file tĩnh, hình ảnh
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
