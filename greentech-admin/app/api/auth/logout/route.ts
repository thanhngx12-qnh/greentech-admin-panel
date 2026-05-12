// File: app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // FIX: Trong Next.js 15, cookies() là một Promise, phải dùng await
    const cookieStore = await cookies();

    cookieStore.delete("access_token");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
