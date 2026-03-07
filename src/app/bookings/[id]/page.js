import Link from 'next/link';
import { CalendarDays, MapPin, Clock, CheckCircle2, Star, ChevronLeft, Stethoscope } from 'lucide-react';

export default function BookingDetailsPage({ params }) {
    return (
        <div className="bg-background-light min-h-screen font-sans text-slate-900 antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 lg:px-10 py-3 shadow-sm">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Stethoscope className="w-7 h-7 text-primary" />
                        <h2 className="text-xl font-bold text-slate-900">BookWell</h2>
                    </Link>
                    <Link href="/dashboard/customer/bookings" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to My Bookings
                    </Link>
                </div>
            </header>

            <main className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Booking Details</h1>
                    <p className="text-slate-500 mt-1">Booking ID: <span className="font-mono text-primary">#BK-{params.id}87231</span></p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left / Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Banner */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                            <div>
                                <p className="font-bold text-green-800">Appointment Confirmed</p>
                                <p className="text-sm text-green-700">Your appointment has been confirmed. You'll receive a reminder 24h before.</p>
                            </div>
                        </div>

                        {/* Provider Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Provider</h2>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhY39ZgjLSgl4wQo35ps5i_1N4gnn-MezqReHqoV_QnsMlhUTdDp0-Zwp1zS2sZRy2eDkDCpwVp-7Zg1I4U94yj5pJ0i7b_uOf17LFJsxYXmpsy8QVEvcVsnXyHObCVzih634ihFrcxIR04ZXE5ms8e6CWCH861MSo9IcSuRu6pZqf3H3s5H6MmVIYpnGsEEvWwFb5DMel_Dou7UXTv2a53jONozg7io6WxnSt6zVFnE5M9Gj5eWfaEz4D5QpXKiaqdD5PtRaUz3U")' }}
                                ></div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Dr. Sarah Mitchell</h3>
                                    <p className="text-primary text-sm font-medium">Cardiologist</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-bold text-slate-900">4.9</span>
                                        <span className="text-xs text-slate-500">(1,240 reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Appointment Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Date</p>
                                        <p className="font-bold text-slate-900">Tuesday, October 24, 2023</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-slate-900">10:00 AM – 10:30 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Location</p>
                                        <p className="font-bold text-slate-900">New York Presbyterian Hospital</p>
                                        <p className="text-sm text-slate-500">525 E 68th St, New York, NY 10065</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leave a Review */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">Leave a Review</h2>
                            <p className="text-slate-500 text-sm mb-4">Please select a convenient time slot for your consultation.</p>

                            <div className="flex items-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} className="text-amber-400 hover:text-amber-500 transition-colors">
                                        <Star className="w-8 h-8 fill-amber-400" />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                rows={4}
                                placeholder="Share your experience with Dr. Sarah Mitchell..."
                            />

                            <button className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors">
                                Submit Review
                            </button>
                        </div>
                    </div>

                    {/* Right / Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Booking Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Service</span>
                                    <span className="font-medium text-slate-900">Standard Consultation</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Duration</span>
                                    <span className="font-medium text-slate-900">30 minutes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Status</span>
                                    <span className="font-semibold text-green-600">Confirmed</span>
                                </div>
                            </div>
                            <div className="border-t border-dashed border-slate-200 mt-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Total Paid</span>
                                    <span className="text-2xl font-black text-slate-900">$150.00</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <button className="w-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2.5 rounded-lg transition-colors text-sm">
                                    Reschedule Appointment
                                </button>
                                <button className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2.5 rounded-lg transition-colors text-sm">
                                    Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
