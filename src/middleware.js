import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth/session';

export async function middleware(request) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const payload = token ? await verifySessionToken(token) : null;
    const user = payload?.sub ? payload : null;
    const role = typeof payload?.role === 'string' ? payload.role : null;
    const { pathname } = request.nextUrl;

    // Routes that require authentication
    const authRequired = ['/book/', '/dashboard/'];
    const isProtected = authRequired.some((path) => pathname.startsWith(path));

    if (isProtected && !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based guards
    if (user && isProtected) {
        if (pathname.startsWith('/dashboard/provider') && role !== 'PROVIDER') {
            return NextResponse.redirect(new URL('/dashboard/customer/bookings', request.url));
        }
        if (pathname.startsWith('/dashboard/customer') && role !== 'CUSTOMER') {
            return NextResponse.redirect(new URL('/dashboard/provider', request.url));
        }
    }

    // Redirect logged-in users away from login/signup
    if (user && (pathname === '/login' || pathname === '/signup')) {
        if (role === 'PROVIDER') {
            return NextResponse.redirect(new URL('/dashboard/provider', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard/customer/bookings', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
