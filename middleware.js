// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Get token from cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // 2. Get user role from cookie (alternative to JWT decode)
  const userRole = request.cookies.get('userRole')?.value;

  // 3. Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated || !['admin', 'super admin'].includes(userRole)) {
      const loginUrl = new URL('/auth/session', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Vendor route protection
  if (pathname.startsWith('/vendor')) {
    if (!isAuthenticated || userRole !== 'vendor') {
      const loginUrl = new URL('/auth/session', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*'
  ]
};