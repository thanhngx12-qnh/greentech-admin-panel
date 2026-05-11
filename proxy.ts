import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Xử lý trang chủ
  if (pathname === '/') {
    return token 
      ? NextResponse.redirect(new URL('/dashboard', request.url)) 
      : NextResponse.redirect(new URL('/login', request.url));
  }

  const isAuthPage = pathname.startsWith('/login');

  // Chặn nếu chưa đăng nhập
  if (!token && !isAuthPage && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Chặn nếu đã đăng nhập mà vào lại login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
