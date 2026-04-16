import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  // 🚫 Block logged-in users from /login
  if (pathname === '/login') {
    if (token) {
      try {
        const payloadPart = token.split('.')[1];
        JSON.parse(Buffer.from(payloadPart, 'base64').toString());

        return NextResponse.redirect(new URL('/dashboard', req.url));
      } catch (err) {
        console.log("INVALID TOKEN", err);
      }
    }
  }

  // 🔐 Protect /admin routes (VULNERABLE)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    let payload: any = null;

    try {
      const payloadPart = token.split('.')[1];
      payload = JSON.parse(
        Buffer.from(payloadPart, 'base64').toString()
      );
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // 🔴 VULNERABLE: trust payload blindly
    if (payload?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*'],
};