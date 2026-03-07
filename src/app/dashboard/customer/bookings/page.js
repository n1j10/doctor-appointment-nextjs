import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
    Stethoscope, CalendarDays, Clock, CheckCircle2,
    AlertCircle, LogOut, User, PlusCircle, XCircle
} from 'lucide-react';
import CancelButton from './CancelButton';

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 ring-yellow-200', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    CONFIRMED: { label: 'Confirmed', color: 'bg-green-50 text-green-700 ring-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-50 text-red-700 ring-red-200', icon: <XCircle className="w-3.5 h-3.5" /> },
    COMPLETED: { label: 'Completed', color: 'bg-blue-50 text-blue-700 ring-blue-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
};

export default async function CustomerBookingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?redirectTo=/dashboard/customer/bookings');

    const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single();
    if (!profile || profile.role !== 'CUSTOMER') redirect('/dashboard/provider');

    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
      id, date, start_time, end_time, status, notes, created_at,
      services(name, price, duration),
      providers!inner(id, specialty, avatar_url, users!inner(name))
    `)
        .eq('customer_id', user.id)
        .order('date', { ascending: false });

    const upcoming = appointments?.filter((a) => a.status !== 'CANCELLED' && a.status !== 'COMPLETED') ?? [];
    const past = appointments?.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED') ?? [];

    return (
        <div className="min-h-screen bg-background-light font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-10 sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Stethoscope className="w-7 h-7 text-primary" />
                        <h2 className="text-lg font-bold text-text-main">BookWell</h2>
                    </Link>
                    <div className="flex items-center gap-5">
                        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
                            <Link href="/providers" className="text-text-sub hover:text-primary transition-colors">Find Providers</Link>
                            <Link href="/dashboard/customer/bookings" className="text-primary font-semibold">My Appointments</Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:flex items-center gap-1.5 text-sm text-text-sub">
                                <User className="w-4 h-4" /> {profile.name}
                            </span>
                            <Link href="/auth/signout" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8 md:px-6">
                {/* Page Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-text-main">My Appointments</h1>
                        <p className="text-text-sub text-sm mt-1">Hello, {profile.name}! Manage your bookings below.</p>
                    </div>
                    <Link href="/providers" className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-5 py-2.5 text-sm font-bold text-white transition-colors self-start">
                        <PlusCircle className="w-4 h-4" /> Book New Appointment
                    </Link>
                </div>

                {appointments?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                        <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No appointments yet</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">Browse providers and book your first appointment.</p>
                        <Link href="/providers" className="rounded-xl bg-primary hover:bg-primary-hover px-6 py-2.5 text-sm font-bold text-white transition-colors">
                            Find a Provider
                        </Link>
                    </div>




                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Upcoming */}
                        {upcoming.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-text-main mb-4">Upcoming ({upcoming.length})</h2>
                                <div className="flex flex-col gap-4">
                                    {upcoming.map((appt) => {
                                        const status = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.PENDING;
                                        const dateStr = new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
                                        
                                        return (
                                            <div key={appt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
                                                {appt.providers?.avatar_url ? (
                                                    <img src={appt.providers.avatar_url} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                        <User className="w-8 h-8 text-primary" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-text-main">{appt.providers?.users?.name}</h3>
                                                        <span className="text-xs text-primary font-medium">{appt.providers?.specialty}</span>
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.color}`}>
                                                            {status.icon} {status.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700">{appt.services?.name}</p>
                                                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-text-sub">
                                                        <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {dateStr}</span>
                                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {appt.start_time} – {appt.end_time}</span>
                                                        {appt.services?.price && <span className="font-semibold text-slate-700">${appt.services.price}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 shrink-0">
                                                    <CancelButton appointmentId={appt.id} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Past */}
                        {past.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-text-main mb-4">Past Appointments ({past.length})</h2>
                                <div className="flex flex-col gap-3">
                                    {past.map((appt) => {
                                        const status = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.COMPLETED;
                                        const dateStr = new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                                        return (
                                            <div key={appt.id} className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3 opacity-80">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-text-main text-sm">{appt.providers?.users?.name}</h3>
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${status.color}`}>
                                                            {status.icon} {status.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">{appt.services?.name} · {dateStr} at {appt.start_time}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

