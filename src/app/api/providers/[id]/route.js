import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/providers/[id] — single provider with services, availability, reviews
export async function GET(request, { params }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: provider, error } = await supabase
        .from('providers')
        .select(`
      id, specialty, bio, avatar_url, rating, review_count,
      users!inner(id, name, email),
      services(id, name, description, duration, price),
      availability(id, day_of_week, start_time, end_time),
      reviews(
        id, rating, comment, created_at,
        users!customer_id(name)
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: provider.id,
        userId: provider.users.id,
        name: provider.users.name,
        email: provider.users.email,
        specialty: provider.specialty,
        bio: provider.bio,
        avatarUrl: provider.avatar_url,
        rating: provider.rating,
        reviewCount: provider.review_count,
        services: provider.services,
        availability: provider.availability,
        reviews: provider.reviews?.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
            customerName: r.users?.name ?? 'Anonymous',
        })),
    });
}
