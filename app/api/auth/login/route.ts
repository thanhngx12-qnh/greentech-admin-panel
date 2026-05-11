import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";
    
    const response = await axios.post(`${backendUrl}/auth/login`, body);
    
    // Log ra để kiểm tra (có thể xóa sau khi chạy ổn)
    console.log("==> CẤU TRÚC BACKEND TRẢ VỀ:", response.data);

    // Tìm token: Kiểm tra ở lớp ngoài HOẶC chui vào trong lớp .data (do backend của anh bọc data)
    const token = response.data?.access_token || 
                  response.data?.data?.access_token || 
                  response.data?.accessToken || 
                  response.data?.data?.accessToken;
    
    if (!token) {
      return NextResponse.json({ 
        message: "Đăng nhập thành công nhưng không tìm thấy token trong phản hồi (access_token).",
        backend_response: response.data 
      }, { status: 400 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });
    
    // Set cookie bảo mật
    res.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Sai email hoặc mật khẩu" }, 
        { status: error.response.status }
      );
    }
    return NextResponse.json({ message: "Không thể kết nối tới Backend" }, { status: 500 });
  }
}
