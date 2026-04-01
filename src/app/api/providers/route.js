import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/providers - list all providers with user info and min service price
export async function GET() {
    try {
        const providers = await prisma.provider.findMany({
            orderBy: { rating: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                services: { select: { price: true } },
            },
        });

        const formatted = providers.map((p) => {
            const prices = p.services.map((s) => s.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

            return {
                id: p.id,
                name: p.user.name,
                email: p.user.email,
                specialty: p.specialty,
                bio: p.bio,
                avatarUrl: p.avatarUrl,
                rating: p.rating,
                reviewCount: p.reviewCount,
                minPrice,
                maxPrice,
            };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Failed to load providers:', error);
        return NextResponse.json({ error: 'Failed to load providers' }, { status: 500 });
    }
}
