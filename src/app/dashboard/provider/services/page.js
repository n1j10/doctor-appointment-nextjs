import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
    Stethoscope, CalendarDays, Clock, Activity, LogOut, User,
    PlusCircle, Trash2, Edit
} from 'lucide-react';

export default async function ProviderServicesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?redirectTo=/dashboard/provider/services');

    const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single();
    if (!profile || profile.role !== 'PROVIDER') redirect('/dashboard/customer/bookings');

    const { data: provider } = await supabase.from('providers').select('id, specialty').eq('user_id', user.id).single();
    if (!provider) redirect('/dashboard/provider');

    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', provider.id)
        .order('name');

    async function addService(formData) {
        'use server';
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data: p } = await supabase.from('providers').select('id').eq('user_id', user.id).single();
        if (!p) return;

        await supabase.from('services').insert({
            provider_id: p.id,
            name: formData.get('name'),
            description: formData.get('description'),
            duration: parseInt(formData.get('duration')),
            price: parseFloat(formData.get('price')),
        });
        revalidatePath('/dashboard/provider/services');
    }

    async function deleteService(formData) {
        'use server';
        const supabase = await createClient();
        const id = formData.get('id');
        await supabase.from('services').delete().eq('id', id);
        revalidatePath('/dashboard/provider/services');
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
                    <Link href="/dashboard/provider/services" className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-primary text-sm font-semibold transition-colors">
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
                {/* Mobile Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        <h2 className="font-bold text-text-main">BookWell</h2>
                    </Link>
                    <Link href="/auth/signout" className="text-sm font-medium text-slate-600">Sign Out</Link>
                </header>

                <div className="p-6 md:p-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-10">

                    {/* Services List */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-text-main">My Services</h1>
                            <p className="text-text-sub mt-1">Manage the services you offer to patients.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {services?.length === 0 ? (
                                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
                                    <p className="text-slate-500">You haven't added any services yet.</p>
                                </div>
                            ) : (
                                services.map((svc) => (
                                    <div key={svc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{svc.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{svc.description}</p>
                                            <div className="flex items-center gap-4 mt-3 text-sm font-medium">
                                                <span className="flex items-center gap-1.5 text-slate-600"><Clock className="w-4 h-4" /> {svc.duration} mins</span>
                                                <span className="text-primary font-bold">${svc.price}</span>
                                            </div>
                                        </div>
                                        <form action={deleteService}>
                                            <input type="hidden" name="id" value={svc.id} />
                                            <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete service">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add New Service Form */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-10">
                            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-primary" /> Add New Service
                            </h2>
                            <form action={addService} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Service Name</label>
                                    <input type="text" name="name" required placeholder="e.g. Initial Consultation" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Description</label>
                                    <textarea name="description" rows={2} placeholder="Briefly describe the service..." className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Duration (mins)</label>
                                        <input type="number" name="duration" required min="15" step="15" placeholder="60" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Price ($)</label>
                                        <input type="number" name="price" required min="0" step="0.01" placeholder="99.00" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                                    </div>
                                </div>
                                <button type="submit" className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold py-2.5 text-sm transition-colors">
                                    Add Service
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
