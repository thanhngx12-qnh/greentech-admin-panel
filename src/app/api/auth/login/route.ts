// File: src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Gọi đến Backend thực sự ở port 3000
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Nếu thành công, trích xuất token và tạo HTTP-Only Cookie
    const token = data.data.access_token;
    const response = NextResponse.json(data, { status: 201 });

    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // Sống trong 7 ngày
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối đến máy chủ Backend" },
      { status: 500 },
    );
  }
}
