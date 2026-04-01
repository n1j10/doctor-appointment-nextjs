import { NextResponse } from 'next/server';

export async function GET(request) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=OAuth callback is not configured`);
}
