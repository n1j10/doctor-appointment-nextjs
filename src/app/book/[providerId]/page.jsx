'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    CalendarDays, Stethoscope, Package, Zap, ClipboardList, Clock,
    Info, ArrowRight, ArrowLeft, Loader2, CheckCircle2, User, LogOut
} from 'lucide-react';

const ICON_MAP = {
    0: <Stethoscope className="w-6 h-6" />,
    1: <Package className="w-6 h-6" />,
    2: <Zap className="w-6 h-6" />,
    3: <ClipboardList className="w-6 h-6" />,
};
const BG_MAP = {
    0: 'bg-blue-100 text-primary',
    1: 'bg-purple-100 text-purple-600',
    2: 'bg-red-100 text-red-600',
    3: 'bg-teal-100 text-teal-600',
};

const steps = ['Select Service', 'Date & Time', 'Confirm'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateTimeSlots(startTime, endTime, duration) {
    const slots = [];

    const toMins = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    const toStr = (m) => {
        const h = Math.floor(m / 60).toString().padStart(2, '0');
        const min = (m % 60).toString().padStart(2, '0');
        return `${h}:${min}`;
    };
    let cur = toMins(startTime);
    const end = toMins(endTime);

    while (cur + duration <= end) {

        slots.push({ start: toStr(cur), end: toStr(cur + duration) });
        cur += duration;
    }
    return slots;
}




export default function BookAppointmentPage({ params }) {
    const router = useRouter();

    const [providerId, setProviderId] = useState(null);
    const [provider, setProvider] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [booked, setBooked] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function init() {
            const { providerId: pid } = await params;
            setProviderId(pid);

            const [providerRes, meRes] = await Promise.all([
                fetch(`/api/providers/${pid}`),
                fetch('/api/auth/me', { cache: 'no-store' }),
            ]);

            if (providerRes.ok) {
                const data = await providerRes.json();
                setProvider(data);
                if (data.services?.length) setSelectedService(data.services[0]);
            }

            if (meRes.ok) {
                const me = await meRes.json();
                setUser(me?.user ?? null);
            } else {
                setUser(null);
            }
            setLoading(false);
        }
        init();
    }, []);

    // Days available for selected provider
    const availableDayNums = provider?.availability?.map((a) => a.day_of_week) ?? [];

    // Build next 14 days for date picker
    const dateOptions = [];

    const today = new Date();
    for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        if (availableDayNums.includes(d.getDay())) {
            dateOptions.push(d);
        }
    }

    // Time slots for selected date
    const timeSlots = (() => {
        if (!selectedDate || !selectedService) return [];

        const dayNum = new Date(selectedDate).getDay();

        const avail = provider?.availability?.find((a) => a.day_of_week === dayNum);

        if (!avail) return [];
        return generateTimeSlots(avail.start_time, avail.end_time, selectedService.duration);
    })();

    const handleBook = async () => {
        if (!selectedService || !selectedDate || !selectedSlot) return;
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerId,
                    serviceId: selectedService.id,
                    date: selectedDate,
                    startTime: selectedSlot.start,
                    endTime: selectedSlot.end,
                    notes,
                }),
            });

            
            if (!res.ok) {
                const d = await res.json();
                setError(d.error ?? 'Failed to book appointment');
                setSubmitting(false);
                return;
            }
            setBooked(true);
        } catch {
            setError('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (booked) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col items-center justify-center gap-6 p-8">

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-10 flex flex-col items-center gap-5 max-w-md w-full text-center">

                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-green-600" />
                    </div>

                    <h2 className="text-2xl font-black text-text-main">Appointment Booked!</h2>

                    <p className="text-text-sub text-sm leading-relaxed">
                        Your appointment with <strong>{provider?.name}</strong> for <strong>{selectedService?.name}</strong> on{' '}
                        <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at{' '}
                        <strong>{selectedSlot?.start}</strong> has been confirmed.
                    </p>

                    
                    <Link href="/dashboard/customer/bookings" className="w-full mt-2 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover py-3 text-sm font-bold text-white transition-colors">
                        View My Appointments
                    </Link>
                    <Link href="/providers" className="text-sm text-primary hover:underline">Find another provider</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light min-h-screen flex flex-col overflow-x-hidden font-sans text-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10 py-3 sticky top-0 z-50 shadow-sm">
                <Link href="/" className="flex items-center gap-3">
                    <CalendarDays className="w-7 h-7 text-primary" />
                    <h2 className="text-slate-900 text-lg font-bold">BookWell</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-6">
                    <Link href="/" className="hidden md:block text-slate-900 text-sm font-medium hover:text-primary transition-colors">Home</Link>
                    <Link href="/providers" className="hidden md:block text-slate-900 text-sm font-medium hover:text-primary transition-colors">Providers</Link>
                    {user ? (
                        <Link href="/auth/signout" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </Link>
                    ) : (
                        <Link href="/login" className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover transition-colors text-white text-sm font-bold">
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 flex justify-center py-10 px-4 md:px-10">
                <div className="w-full max-w-[1024px] flex flex-col gap-8">
                    {/* Hero */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">Book an Appointment</h1>

                        {provider && (
                            <p className="text-slate-500 text-base">With
                             <span className="font-semibold text-primary">{provider.name}</span> 
                             · {provider.specialty}</p>
                        )}
                    </div>

                    {/* Stepper */}
                    <div className="hidden md:flex items-center justify-between w-full relative">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full" />

                        {steps.map((s, i) => (
                            <div key={s} className="flex flex-col items-center gap-2 bg-background-light px-2">
                                <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ring-4
                                     ring-background-light 
                                     ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-2 border-slate-300 text-slate-500'}`}>
                                    {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                                </div>
                                <span className={`text-sm font-${i === step ? 'bold text-primary' : 'medium text-slate-500'}`}>{s}</span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            <Info className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Form */}
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">




                            {/* Step 0: Select Service */}
                            {step === 0 && (
                                <>
                                    <div className="p-6 border-b border-slate-100">
                                        <h2 className="text-slate-900 text-xl font-bold">Step 1: Choose a Service</h2>
                                        <p className="text-slate-500 text-sm mt-1">Select the type of appointment you would like to book.</p>
                                    </div>
                                    <div className="p-6 flex flex-col gap-4">
                                        {provider?.services?.map((svc, i) => (
                                            <label
                                                key={svc.id}
                                                onClick={() => setSelectedService(svc)}
                                                className={`group relative flex cursor-pointer rounded-xl border p-4 transition-all ${selectedService?.id === svc.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:border-primary hover:bg-primary/5'}`}
                                            >
                                                <div className="flex w-full items-center gap-4">
                                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${BG_MAP[i % 4]}`}>
                                                        {ICON_MAP[i % 4]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{svc.name}</span>
                                                        
                                                        <span className="text-sm text-slate-500">{svc.duration} mins{svc.description ? ` · ${svc.description}` : ''}</span>
                                                    </div>
                                                    <div className="ml-auto flex shrink-0 items-center gap-3">
                                                        <span className="text-sm font-bold text-slate-900">${svc.price}</span>
                                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                                                             ${selectedService?.id === svc.id ? 'border-primary bg-primary' : 'border-slate-300'}`}> {selectedService?.id === svc.id && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="bg-slate-50 p-6 flex justify-end border-t border-slate-100">
                                        <button onClick={() => setStep(1)} disabled={!selectedService} className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                                            Next Step <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Step 1: Date & Time */}
                            {step === 1 && (
                                <>
                                    <div className="p-6 border-b border-slate-100">
                                        <h2 className="text-slate-900 text-xl font-bold">Step 2: Pick a Date & Time</h2>
                                        <p className="text-slate-500 text-sm mt-1">Available slots for {selectedService?.name} ({selectedService?.duration} mins).</p>
                                    </div>
                                    <div className="p-6 flex flex-col gap-6">
                                        {/* Dates */}
                                        <div>
                                            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Select Date</h3>
                                            {dateOptions.length === 0 ? (
                                                <p className="text-sm text-slate-500 italic">No available dates in the next 14 days.</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {dateOptions.map((d) => {
                                                        const iso = d.toISOString().split('T')[0];
                                                        const selected = selectedDate === iso;
                                                        return (
                                                            <button
                                                                key={iso}
                                                                onClick={() => { setSelectedDate(iso); setSelectedSlot(null); }}
                                                                className={`flex flex-col items-center rounded-xl px-4 py-3 border-2 min-w-[70px] transition-all ${selected ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'}`}
                                                            >
                                                                <span className="text-xs font-medium">{DAYS[d.getDay()]}</span>
                                                                <span className="text-xl font-black leading-tight">{d.getDate()}</span>
                                                                <span className="text-xs">{d.toLocaleString('en', { month: 'short' })}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Time Slots */}
                                        {selectedDate && (
                                            <div>
                                                <h3 className="font-semibold text-slate-700 mb-3 text-sm">Select Time</h3>
                                                {timeSlots.length === 0 ? (
                                                    <p className="text-sm text-slate-500 italic">No slots available for this day.</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {timeSlots.map((slot) => {
                                                            const isSelected = selectedSlot?.start === slot.start;
                                                            return (
                                                                <button
                                                                    key={slot.start}
                                                                    onClick={() => setSelectedSlot(slot)}
                                                                    className={`rounded-lg px-4 py-2.5 border-2 text-sm font-semibold transition-all ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'}`}
                                                                >
                                                                    {slot.start}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Notes */}
                                        <div>
                                            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Notes (optional)</h3>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={3}
                                                placeholder="Any specific concerns or information for your provider..."
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 flex justify-between border-t border-slate-100">
                                        <button onClick={() => setStep(0)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button onClick={() => setStep(2)} disabled={!selectedDate || !selectedSlot} className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                                            Review Booking <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Step 2: Confirm */}
                            {step === 2 && (
                                <>
                                    <div className="p-6 border-b border-slate-100">
                                        <h2 className="text-slate-900 text-xl font-bold">Step 3: Confirm Booking</h2>
                                        <p className="text-slate-500 text-sm mt-1">Review your appointment details before confirming.</p>
                                    </div>
                                    <div className="p-6 flex flex-col gap-5">
                                        {[
                                            { label: 'Provider', value: provider?.name },
                                            { label: 'Specialty', value: provider?.specialty },
                                            { label: 'Service', value: `${selectedService?.name} (${selectedService?.duration} mins)` },
                                            { label: 'Date', value: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                                            { label: 'Time', value: `${selectedSlot?.start} – ${selectedSlot?.end}` },
                                            { label: 'Price', value: `$${selectedService?.price}` },
                                            ...(notes ? [{ label: 'Notes', value: notes }] : []),
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex justify-between items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                                                <span className="text-slate-900 font-medium text-sm text-right max-w-[60%]">{value}</span>
                                            </div>
                                        ))}
                                    </div>




                                    <div className="bg-slate-50 p-6 flex justify-between border-t border-slate-100">
                                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button onClick={handleBook} disabled={submitting} className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            {submitting ? 'Booking...' : 'Confirm Booking'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                                {provider && (
                                    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                                        {provider.avatarUrl ? (
                                            <img src={provider.avatarUrl} alt={provider.name} className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{provider.name}</p>
                                            <p className="text-xs text-primary">{provider.specialty}</p>
                                        </div>
                                    </div>
                                )}
                                <h3 className="text-slate-900 font-bold text-lg mb-4">Booking Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service</span>
                                            <span className="text-slate-900 font-medium">{selectedService?.name ?? '—'}</span>
                                        </div>
                                        {selectedService && <span className="text-primary font-bold">${selectedService.price}</span>}
                                    </div>
                                    <div className="flex flex-col pb-4 border-b border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                                        <span className="text-slate-900 font-medium flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            {selectedService ? `${selectedService.duration} mins` : '—'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col pb-4 border-b border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</span>
                                        <span className="text-slate-900 font-medium text-sm">
                                            {selectedDate && selectedSlot
                                                ? `${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })} at ${selectedSlot.start}`
                                                : <span className="italic text-slate-400">Not selected yet</span>}
                                        </span>
                                    </div>
                                </div>
                                {selectedService && (
                                    <div className="mt-5 pt-4 border-t border-dashed border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-slate-500 font-medium">Total</span>
                                            <span className="text-2xl font-black text-slate-900">${selectedService.price}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg flex gap-3 items-start">
                                    <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-800 leading-relaxed">Free cancellation up to 24 hours before your appointment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
