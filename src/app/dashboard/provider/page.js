import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
    Stethoscope, CalendarDays, Clock, CheckCircle2,
    Users, Activity, DollarSign, LogOut, User
} from 'lucide-react';

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 ring-yellow-200' },
    CONFIRMED: { label: 'Confirmed', color: 'bg-green-50 text-green-700 ring-green-200' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-50 text-red-700 ring-red-200' },
    COMPLETED: { label: 'Completed', color: 'bg-blue-50 text-blue-700 ring-blue-200' },
};

export default async function ProviderDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?redirectTo=/dashboard/provider');

    const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single();
    if (!profile || profile.role !== 'PROVIDER') redirect('/dashboard/customer/bookings');

    // Get provider record
    const { data: provider } = await supabase.from('providers').select('id, specialty, rating, review_count').eq('user_id', user.id).single();

    if (!provider) {
        return (
            <div className="min-h-screen bg-background-light p-8 flex items-center justify-center text-center">
                <div>
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Provider record not found</h2>
                    <p className="text-slate-500">Please contact support.</p>
                </div>
            </div>
        );
    }

    // Get appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
      id, date, start_time, end_time, status,
      services(name, price),
      users!customer_id(name, email)
    `)
        .eq('provider_id', provider.id)
        .order('date', { ascending: false });

    const appts = appointments ?? [];
    const upcoming = appts.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');
    const completed = appts.filter((a) => a.status === 'COMPLETED');

    // Calculate revenue (completed appointments)
    const totalRevenue = completed.reduce((sum, a) => sum + (a.services?.price ?? 0), 0);

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
                    <Link href="/dashboard/provider" className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-primary text-sm font-semibold transition-colors">
                        <Activity className="w-5 h-5" /> Overview
                    </Link>
                    <Link href="/dashboard/provider/calendar" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <CalendarDays className="w-5 h-5" /> Calendar
                    </Link>
                    <Link href="/dashboard/provider/services" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <Stethoscope className="w-5 h-5" /> Services
                    </Link>
                    <Link href="/dashboard/provider/availability" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
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
                {/* Mobile Header (visible only on small screens) */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        <h2 className="font-bold text-text-main">BookWell</h2>
                    </Link>
                    <Link href="/auth/signout" className="text-sm font-medium text-slate-600">Sign Out</Link>
                </header>

                <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-black text-text-main">Dashboard</h1>
                        <p className="text-text-sub mt-1">Welcome back, {profile.name}. Here is what's happening today.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Upcoming</p>
                                    <p className="text-2xl font-black text-slate-900">{upcoming.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Completed</p>
                                    <p className="text-2xl font-black text-slate-900">{completed.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Est. Revenue</p>
                                    <p className="text-2xl font-black text-slate-900">${totalRevenue}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Rating</p>
                                    <p className="text-2xl font-black text-slate-900">{provider.rating.toFixed(1)} <span className="text-sm font-normal text-slate-500">({provider.review_count})</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Appointments */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900">Recent Appointments</h2>
                            <Link href="/dashboard/provider/calendar" className="text-sm font-semibold text-primary hover:underline">View Calendar</Link>
                        </div>

                        {appts.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-slate-500">No appointments found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">Patient</th>
                                            <th className="px-6 py-4 font-semibold">Service</th>
                                            <th className="px-6 py-4 font-semibold">Date & Time</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {appts.slice(0, 10).map((a) => {
                                            const status = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.PENDING;
                                            return (
                                                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-slate-900">{a.users?.name}</p>
                                                        <p className="text-xs text-slate-500">{a.users?.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {a.services?.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-slate-900">{new Date(a.date + 'T00:00:00').toLocaleDateString()}</p>
                                                        <p className="text-xs text-slate-500">{a.start_time} - {a.end_time}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {a.status === 'PENDING' && (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <form action={`/api/appointments/${a.id}`} method="post" className="inline">
                                                                    <input type="hidden" name="status" value="CONFIRMED" />
                                                                    <button type="submit" className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded transition-colors">Confirm</button>
                                                                </form>
                                                                <form action={`/api/appointments/${a.id}`} method="post" className="inline">
                                                                    <input type="hidden" name="status" value="CANCELLED" />
                                                                    <button type="submit" className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded transition-colors">Cancel</button>
                                                                </form>
                                                            </div>
                                                        )}
                                                        {a.status === 'CONFIRMED' && (
                                                            <form action={`/api/appointments/${a.id}`} method="post" className="inline">
                                                                <input type="hidden" name="status" value="COMPLETED" />
                                                                <button type="submit" className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded transition-colors">Mark Complete</button>
                                                            </form>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
