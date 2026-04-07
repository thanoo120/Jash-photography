import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, since auth is client-side, we can't check server-side easily.
  // But we can redirect /admin to / if not admin, but since tokens are in localStorage, it's hard.
  // For better security, perhaps check for a cookie or something.

  // For this implementation, we'll rely on client-side check.
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};