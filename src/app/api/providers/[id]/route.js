import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/providers/[id] - single provider with services, availability, reviews
export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const provider = await prisma.provider.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                services: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        duration: true,
                        price: true,
                    },
                    orderBy: { name: 'asc' },
                },
                availability: {
                    select: {
                        id: true,
                        dayOfWeek: true,
                        startTime: true,
                        endTime: true,
                    },
                    orderBy: { dayOfWeek: 'asc' },
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        customer: { select: { name: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!provider) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: provider.id,
            userId: provider.user.id,
            name: provider.user.name,
            email: provider.user.email,
            specialty: provider.specialty,
            bio: provider.bio,
            avatarUrl: provider.avatarUrl,
            rating: provider.rating,
            reviewCount: provider.reviewCount,
            services: provider.services,
            availability: provider.availability.map((a) => ({
                id: a.id,
                day_of_week: a.dayOfWeek,
                start_time: a.startTime,
                end_time: a.endTime,
            })),
            reviews: provider.reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                customerName: r.customer?.name ?? 'Anonymous',
            })),
        });
    } catch (error) {
        console.error('Failed to load provider:', error);
        return NextResponse.json({ error: 'Failed to load provider' }, { status: 500 });
    }
}
