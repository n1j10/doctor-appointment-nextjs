import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/server';
import { toDateOnlyString } from '@/lib/date';

// GET /api/appointments - list appointments for authenticated user
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let where;
        if (user.role === 'PROVIDER') {
            const providerRow = await prisma.provider.findUnique({
                where: { userId: user.id },
                select: { id: true },
            });

            if (!providerRow) return NextResponse.json([]);
            where = { providerId: providerRow.id };
        } else {
            where = { customerId: user.id };
        }

        const appointments = await prisma.appointment.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                service: { select: { name: true, price: true, duration: true } },
                provider: {
                    select: {
                        id: true,
                        specialty: true,
                        avatarUrl: true,
                        user: { select: { name: true } },
                    },
                },
                customer: { select: { name: true, email: true } },
            },
        });

        const formatted = appointments.map((a) => ({
            id: a.id,
            date: toDateOnlyString(a.date),
            start_time: a.startTime,
            end_time: a.endTime,
            status: a.status,
            notes: a.notes,
            created_at: a.createdAt,
            services: a.service
                ? {
                    name: a.service.name,
                    price: a.service.price,
                    duration: a.service.duration,
                }
                : null,
            providers: a.provider
                ? {
                    id: a.provider.id,
                    specialty: a.provider.specialty,
                    avatar_url: a.provider.avatarUrl,
                    users: a.provider.user ? { name: a.provider.user.name } : null,
                }
                : null,
            users: a.customer
                ? {
                    name: a.customer.name,
                    email: a.customer.email,
                }
                : null,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Failed to load appointments:', error);
        return NextResponse.json({ error: 'Failed to load appointments' }, { status: 500 });
    }
}







// POST /api/appointments - create a new appointment
export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { providerId, serviceId, date, startTime, endTime, notes } = body;

        if (!providerId || !serviceId || !date || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const provider = await prisma.provider.findUnique({
            where: { id: providerId },
            select: { id: true },
        });

        

        if (!provider) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                providerId,
            },
            select: { id: true },
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found for this provider' }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                customerId: user.id,
                providerId,
                serviceId,
                date: new Date(`${date}T00:00:00.000Z`),
                startTime,
                endTime,
                notes: notes ?? null,
                status: 'PENDING',
            },
        });

        return NextResponse.json({
            id: appointment.id,
            customer_id: appointment.customerId,
            provider_id: appointment.providerId,
            service_id: appointment.serviceId,
            date: toDateOnlyString(appointment.date),
            start_time: appointment.startTime,
            end_time: appointment.endTime,
            notes: appointment.notes,
            status: appointment.status,
            created_at: appointment.createdAt,
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
