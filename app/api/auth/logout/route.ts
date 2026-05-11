import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Xoá HTTP-Only Cookie an toàn từ phía Server (Route handler)
  res.cookies.delete("access_token");
  return res;
}
