import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/server';

// GET /api/reviews?providerId=xxx
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    if (!providerId) {
        return NextResponse.json({ error: 'providerId is required' }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                customer: { select: { name: true } },
            },
        });

        return NextResponse.json(
            reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                created_at: r.createdAt,
                users: r.customer ? { name: r.customer.name } : null,
            }))
        );
    } catch (error) {
        console.error('Failed to load reviews:', error);
        return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 });
    }
}

// POST /api/reviews
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { providerId, rating, comment } = await request.json();

        if (!providerId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const numericRating = Number(rating);
        if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                providerId,
                customerId: user.id,
                rating: Math.round(numericRating),
                comment: comment ?? null,
            },
            select: {
                id: true,
                providerId: true,
                customerId: true,
                rating: true,
                comment: true,
                createdAt: true,
            },
        });

        const aggregate = await prisma.review.aggregate({
            where: { providerId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await prisma.provider.update({
            where: { id: providerId },
            data: {
                rating: aggregate._avg.rating ?? 0,
                reviewCount: aggregate._count.rating,
            },
        });

        return NextResponse.json({
            id: review.id,
            provider_id: review.providerId,
            customer_id: review.customerId,
            rating: review.rating,
            comment: review.comment,
            created_at: review.createdAt,
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to create review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
