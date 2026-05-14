// File: src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Trả về response thành công
  const response = NextResponse.json({
    success: true,
    message: "Đăng xuất thành công",
  });

  // Xóa HTTP-Only cookie có tên 'access_token'
  response.cookies.delete("access_token");

  return response;
}
