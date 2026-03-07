import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/reviews?providerId=xxx
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    if (!providerId) {
        return NextResponse.json({ error: 'providerId is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, users!customer_id(name)')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data ?? []);
}

// POST /api/reviews
export async function POST(request) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { providerId, rating, comment } = await request.json();

    if (!providerId || !rating) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('reviews')
        .insert({ provider_id: providerId, customer_id: user.id, rating, comment })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
}
