import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/appointments — list appointments for authenticated user
export async function GET(request) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('users').select('role').eq('id', user.id).single();

    let query = supabase
        .from('appointments')
        .select(`
      id, date, start_time, end_time, status, notes, created_at,
      services(name, price, duration),
      providers!inner(
        id, specialty, avatar_url,
        users!inner(name)
      ),
      users!customer_id(name, email)
    `)
        .order('date', { ascending: false });

    if (profile?.role === 'PROVIDER') {
        const { data: providerRow } = await supabase
            .from('providers').select('id').eq('user_id', user.id).single();
        if (!providerRow) return NextResponse.json([]);
        query = query.eq('provider_id', providerRow.id);
    } else {
        query = query.eq('customer_id', user.id);
    }

    const { data: appointments, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(appointments ?? []);
}

// POST /api/appointments — create a new appointment
export async function POST(request) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { providerId, serviceId, date, startTime, endTime, notes } = body;

    if (!providerId || !serviceId || !date || !startTime || !endTime) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('appointments').insert({
            customer_id: user.id,
            provider_id: providerId,
            service_id: serviceId,
            date,
            start_time: startTime,
            end_time: endTime,
            notes: notes ?? null,
            status: 'PENDING',
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
}
