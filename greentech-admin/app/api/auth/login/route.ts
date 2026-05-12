// File: app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { access_token } = body;

    if (!access_token) {
      return NextResponse.json(
        { message: "Access token is required" },
        { status: 400 },
      );
    }

    // FIX: Trong Next.js 15, cookies() là một Promise, phải dùng await
    const cookieStore = await cookies();

    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 giờ
    });

    return NextResponse.json({
      success: true,
      message: "Token stored in cookie",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
