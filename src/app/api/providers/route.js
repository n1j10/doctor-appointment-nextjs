import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/providers — list all providers with user info and min service price
export async function GET() {
    const supabase = await createClient();

    const { data: providers, error } = await supabase.from('providers')
        .select(`
      id, specialty, bio, avatar_url, rating, review_count,
      users!inner(name, email),
      services(price)
    `)
        .order('rating', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Compute min price and format response
    const formatted = providers.map((p) => {
        const prices = p.services?.map((s) => s.price) ?? [];
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
        
        return {
            id: p.id,
            name: p.users.name,
            email: p.users.email,
            specialty: p.specialty,
            bio: p.bio,
            avatarUrl: p.avatar_url,
            rating: p.rating,
            reviewCount: p.review_count,
            minPrice,
            maxPrice,
        };
    });

    return NextResponse.json(formatted);
}
