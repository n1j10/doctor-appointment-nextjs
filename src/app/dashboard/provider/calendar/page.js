import Link from 'next/link';
import { Stethoscope, ChevronLeft, ChevronRight, CheckCircle2, Clock, X } from 'lucide-react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calDays = [
    { num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }, { num: 6 }, { num: 7 },
    { num: 8 }, { num: 9 }, { num: 10 }, { num: 11 }, { num: 12 }, { num: 13 }, { num: 14 },
    { num: 15 }, { num: 16 }, { num: 17 }, { num: 18 }, { num: 19, today: true }, { num: 20, appt: true }, { num: 21, appt: true },
    { num: 22 }, { num: 23 }, { num: 24, appt: true }, { num: 25 }, { num: 26 }, { num: 27 }, { num: 28 },
    { num: 29 }, { num: 30 }, { num: 31 },
];

const appointments = [
    { name: 'Dr. Emily Chen', type: 'Cardiology Consultation', time: '09:00 AM', duration: '30 min', status: 'upcoming' },
    { name: 'Dr. James Wilson', type: 'Echocardiogram', time: '10:30 AM', duration: '60 min', status: 'upcoming' },
    { name: 'Dr. Sarah Mitchell', type: 'Follow-up Visit', time: '01:00 PM', duration: '15 min', status: 'completed' },
];

export default function ProviderCalendarPage() {
    return (
        <div className="bg-background-light min-h-screen font-sans text-slate-900 antialiased">
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 lg:px-10 py-3 shadow-sm">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Stethoscope className="w-7 h-7 text-primary" />
                        <h2 className="text-xl font-bold text-slate-900">BookWell</h2>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/dashboard/provider/calendar" className="text-primary text-sm font-bold">Calendar</Link>
                        <Link href="/dashboard/provider/availability" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Availability</Link>
                        <Link href="/dashboard/provider/services" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Services</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">October 2023</h2>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                                <button className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Today</button>
                                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {days.map(d => (
                                    <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
                                ))}
                            </div>
                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calDays.map(({ num, today, appt }) => (
                                    <button
                                        key={num}
                                        className={`aspect-square flex flex-col items-center justify-center rounded-full text-sm font-medium transition-all relative ${today
                                                ? 'bg-primary text-white font-bold shadow-md'
                                                : appt
                                                    ? 'text-slate-900 hover:bg-blue-50 border border-primary/20'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {num}
                                        {appt && !today && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"></span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="w-full lg:w-80 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Appointments</h3>
                            <div className="space-y-4">
                                {appointments.map((a, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${a.status === 'completed' ? 'border-slate-100 bg-slate-50 opacity-70' : 'border-primary/20 bg-blue-50/50'}`}>
                                        <div className={`mt-0.5 ${a.status === 'completed' ? 'text-green-500' : 'text-primary'}`}>
                                            {a.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{a.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{a.type}</p>
                                            <p className="text-xs text-primary font-medium mt-1">{a.time} · {a.duration}</p>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
