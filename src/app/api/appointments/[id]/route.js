import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/server';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

async function parseStatus(request) {

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        const body = await request.json().catch(() => ({}));
        return body?.status;
    }

    const form = await request.formData().catch(() => null);
    return form?.get('status');
}





async function updateAppointmentStatus(request, id) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const status = String(await parseStatus(request) || '').toUpperCase();
        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const existing = await prisma.appointment.findUnique({
            where: { id },
            select: {
                id: true,
                customerId: true,
                provider: { select: { userId: true } },
            },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        const isCustomer = existing.customerId === user.id;
        const isProvider = existing.provider?.userId === user.id;

        
        if (!isCustomer && !isProvider) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Failed to update appointment:', error);
        return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
}














// PATCH /api/appointments/[id] - update appointment status
export async function PATCH(request, { params }) {
    const { id } = await params;
    return updateAppointmentStatus(request, id);
}

// POST /api/appointments/[id] - supports HTML forms for status changes
export async function POST(request, { params }) {
    const { id } = await params;
    return updateAppointmentStatus(request, id);
}
