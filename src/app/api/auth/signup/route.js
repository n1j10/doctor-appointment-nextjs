import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createSessionResponse } from '@/lib/auth/server';

const PROVIDER_DEFAULT_SPECIALTY = 'General Practice';

export async function POST(request) {
    try {
        const { name, email, password, role, specialty } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        if (String(password).length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedRole = role === Role.PROVIDER ? Role.PROVIDER : Role.CUSTOMER;


        
        const existing = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    name: String(name).trim(),
                    email: normalizedEmail,
                    passwordHash,
                    role: normalizedRole,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                },
            });

            if (normalizedRole === Role.PROVIDER) {
                await tx.provider.create({
                    data: {
                        userId: createdUser.id,
                        specialty: String(specialty || '').trim() || PROVIDER_DEFAULT_SPECIALTY,
                        bio: '',
                    },
                });
            }

            return createdUser;
        });

        const response = NextResponse.json({ user }, { status: 201 });
        await createSessionResponse(response, user);
        return response;
    } catch (error) {
        console.error('Sign up error:', error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
