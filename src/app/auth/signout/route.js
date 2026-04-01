import { NextResponse } from 'next/server';
import { clearSessionResponse } from '@/lib/auth/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirectTo') ?? '/';
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    clearSessionResponse(response);
    return response;
}
