import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();
    await supabase.auth.signOut();
    // Redirect to home after sign out
    const redirectTo = searchParams.get('redirectTo') ?? '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
}
