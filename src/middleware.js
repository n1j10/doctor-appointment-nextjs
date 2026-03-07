import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session — IMPORTANT: don't remove this
    const { data: { user } } = await supabase.auth.getUser();

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
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;

        if (pathname.startsWith('/dashboard/provider') && role !== 'PROVIDER') {
            return NextResponse.redirect(new URL('/dashboard/customer/bookings', request.url));
        }
        if (pathname.startsWith('/dashboard/customer') && role !== 'CUSTOMER') {
            return NextResponse.redirect(new URL('/dashboard/provider', request.url));
        }
    }

    // Redirect logged-in users away from login/signup
    if (user && (pathname === '/login' || pathname === '/signup')) {
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role === 'PROVIDER') {
            return NextResponse.redirect(new URL('/dashboard/provider', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard/customer/bookings', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
