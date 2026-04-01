import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/server';
import {
    Stethoscope, CalendarDays, Clock, Activity, LogOut, User, Check, AlertCircle, PlusCircle
} from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default async function ProviderAvailabilityPage() {


    const user = await getCurrentUser();
    if (!user) redirect('/login?redirectTo=/dashboard/provider/availability');

    const profile = { name: user.name, role: user.role };
    if (!profile || profile.role !== 'PROVIDER') redirect('/dashboard/customer/bookings');

    const provider = await prisma.provider.findUnique({
        where: { userId: user.id },
        select: { id: true, specialty: true },
    });
    if (!provider) redirect('/dashboard/provider');

    const availabilityRows = await prisma.availability.findMany({
        where: { providerId: provider.id },
        orderBy: { dayOfWeek: 'asc' },
    });

    const availability = availabilityRows.map((a) => ({
        id: a.id,
        day_of_week: a.dayOfWeek,
        start_time: a.startTime,
        end_time: a.endTime,
    }));

    async function updateAvailability(formData) {
        'use server';
        const actionUser = await getCurrentUser();
        if (!actionUser) return;

        const p = await prisma.provider.findUnique({
            where: { userId: actionUser.id },
            select: { id: true },
        });
        if (!p) return;

        const dayOfWeek = parseInt(String(formData.get('day_of_week')), 10);
        const startTime = String(formData.get('start_time') || '').trim();
        const endTime = String(formData.get('end_time') || '').trim();
        const actionType = formData.get('actionType'); // 'save' or 'delete'

        if (actionType === 'delete') {
            await prisma.availability.deleteMany({
                where: { providerId: p.id, dayOfWeek },
            });
        } else {
            await prisma.availability.upsert({
                where: {
                    providerId_dayOfWeek: {
                        providerId: p.id,
                        dayOfWeek,
                    },
                },
                update: {
                    startTime,
                    endTime,
                },
                create: {
                    providerId: p.id,
                    dayOfWeek,
                    startTime,
                    endTime,
                },
            });
        }

        revalidatePath('/dashboard/provider/availability');
    }

    return (
        <div className="min-h-screen bg-background-light font-sans flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-3">
                        <Stethoscope className="w-7 h-7 text-primary" />
                        <h2 className="text-lg font-bold text-text-main">BookWell</h2>
                    </Link>
                </div>
                <nav className="p-4 flex flex-col gap-2 flex-1">
                    <Link href="/dashboard/provider" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <Activity className="w-5 h-5" /> Overview
                    </Link>
                    <Link href="/dashboard/provider/calendar" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <CalendarDays className="w-5 h-5" /> Calendar
                    </Link>
                    <Link href="/dashboard/provider/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <Stethoscope className="w-5 h-5" /> Services
                    </Link>
                    <Link href="/dashboard/provider/availability" className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-primary text-sm font-semibold transition-colors">
                        <Clock className="w-5 h-5" /> Availability
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm text-text-main truncate">Dr. {profile.name.split(' ').pop()}</p>
                            <p className="text-xs text-text-sub truncate">{provider.specialty}</p>
                        </div>
                    </div>
                    <Link href="/auth/signout" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 text-sm font-medium transition-colors w-full">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        <h2 className="font-bold text-text-main">BookWell</h2>
                    </Link>
                    <Link href="/auth/signout" className="text-sm font-medium text-slate-600">Sign Out</Link>
                </header>

                <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-black text-text-main">Weekly Availability</h1>
                        <p className="text-text-sub mt-1">Set the times when you are available for appointments.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        
                        <div className="p-5 border-b border-slate-100 bg-slate-50 text-sm font-semibold text-slate-500">
                            <div className="grid grid-cols-12 gap-4 items-center pl-16">
                                <div className="col-span-4">Day</div>
                                <div className="col-span-5 flex justify-between px-2">
                                    <span>Start Time</span>
                                    <span>End Time</span>
                                </div>
                                <div className="col-span-3 text-right">Actions</div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {DAYS.map((dayName, dayIndex) => {
                                const avail = availability?.find((a) => a.day_of_week === dayIndex);
                                const isWorking = !!avail;

                                return (
                                    <form key={dayIndex} action={updateAvailability} className={`p-5 transition-colors ${isWorking ? '' : 'bg-slate-50/50 opacity-70 hover:opacity-100 focus-within:opacity-100'}`}>
                                        <input type="hidden" name="day_of_week" value={dayIndex} />

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            <div className="md:col-span-1 flex items-center justify-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isWorking ? 'bg-primary text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                                    <CalendarDays className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="md:col-span-3 font-semibold text-slate-900">
                                                {dayName}
                                                {!isWorking && <span className="ml-2 text-xs font-normal text-slate-500">(Off)</span>}
                                            </div>

                                            <div className="md:col-span-5 flex items-center gap-3">
                                                <input
                                                    type="time"
                                                    name="start_time"
                                                    defaultValue={avail?.start_time ?? '09:00'}
                                                    className="w-full max-w-[120px] rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                                    required
                                                />
                                                <span className="text-slate-400 font-medium">to</span>
                                                <input
                                                    type="time"
                                                    name="end_time"
                                                    defaultValue={avail?.end_time ?? '17:00'}
                                                    className="w-full max-w-[120px] rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-3 flex justify-end gap-2">
                                                {isWorking ? (
                                                    <>
                                                        <input type="hidden" name="actionType" value="save" />
                                                        <button type="submit" className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors">
                                                            <Check className="w-4 h-4" /> Save
                                                        </button>
                                                        <button type="submit" formAction={async (formData) => {
                                                            'use server';
                                                            formData.append('actionType', 'delete');
                                                            await updateAvailability(formData);
                                                        }} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                                                            Set Off
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <input type="hidden" name="actionType" value="save" />
                                                        <button type="submit" className="flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-primary px-4 py-2 rounded-lg transition-colors">
                                                            <PlusCircle className="w-4 h-4" /> Add Slot
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-700">
                        <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                        <p>Your availability dictates which slots customers can book. Appointments are created in the intervals defined by your service durations.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
