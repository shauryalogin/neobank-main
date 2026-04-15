import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  // 🚫 Block logged-in users from /login
  if (pathname === '/login') {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } catch (err) {
        console.log("INVALID TOKEN", err);
      }
    }
  }

  // 🔐 Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload }: any = await jwtVerify(token, secret);

      // 🚫 Not admin → block
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

    } catch (err) {
      console.log("INVALID TOKEN", err);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*'],
};