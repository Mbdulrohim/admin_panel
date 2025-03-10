import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isApiRoute = path.startsWith('/api');
  const isProtectedPage = path.startsWith('/dashboard') || path.startsWith('/settings');

  // Skip middleware for login page and public APIs
  if (path === '/login' || (isApiRoute && !path.startsWith('/api/protected'))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('adminToken')?.value;

  // Handle API routes differently
  if (isApiRoute) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role?: string };
      const response = NextResponse.next();
      response.headers.set('x-admin-id', decoded.id);
      return response;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  // Handle page routes
  if (isProtectedPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/protected/:path*' // Protect specific API routes
  ],
};