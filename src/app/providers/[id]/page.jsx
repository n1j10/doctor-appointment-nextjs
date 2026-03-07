import Link from 'next/link';
import {
    Search, Briefcase, MapPin, Star, MessageCircle, Share2,
    Heart, ChevronLeft, ChevronRight, Lock, Stethoscope, Activity,
    PersonStanding, Droplets, Info, HeartPulse
} from 'lucide-react';

export default function ProviderProfilePage({ params }) {
    const providerId = params.id;

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light text-text-main font-sans antialiased overflow-x-hidden">

            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-4 md:px-10 py-3 shadow-sm">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/" className="flex items-center gap-3 text-slate-900">
                        <div className="flex items-center justify-center rounded-lg bg-blue-50 p-2 text-primary">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight hidden sm:block">BookWell</h2>
                    </Link>
                    <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <div className="text-slate-500 flex items-center justify-center pl-4 rounded-l-lg">
                                <Search className="w-5 h-5" />
                            </div>
                            <input className="flex w-full min-w-0 flex-1 bg-transparent focus:outline-none border-none text-slate-900 placeholder:text-slate-500 px-3 text-sm font-normal" placeholder="Search doctors..." />
                        </div>
                    </label>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/providers" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Doctors</Link>
                        <Link href="/providers" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Specialties</Link>
                        <Link href="/providers" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Clinics</Link>
                    </nav>
                    <div className="flex gap-2">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors text-sm font-bold">
                            Log In
                        </button>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary text-white hover:bg-primary-hover transition-colors text-sm font-bold shadow-sm">
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 py-6 md:px-8 md:py-8 lg:px-12">
                {/* Breadcrumbs */}
                <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary transition-colors">Home</Link>
                    <span className="text-slate-400">/</span>
                    <Link href="/providers" className="text-slate-500 hover:text-primary transition-colors">Cardiologists</Link>
                    <span className="text-slate-400">/</span>
                    <span className="text-primary font-medium">Dr. Sarah Smith</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Profile & Info */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="relative group">
                                    <div
                                        className="bg-center bg-no-repeat bg-cover rounded-xl w-32 h-32 md:w-40 md:h-40 shadow-inner"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhY39ZgjLSgl4wQo35ps5i_1N4gnn-MezqReHqoV_QnsMlhUTdDp0-Zwp1zS2sZRy2eDkDCpwVp-7Zg1I4U94yj5pJ0i7b_uOf17LFJsxYXmpsy8QVEvcVsnXyHObCVzih634ihFrcxIR04ZXE5ms8e6CWCH861MSo9IcSuRu6pZqf3H3s5H6MmVIYpnGsEEvWwFb5DMel_Dou7UXTv2a53jONozg7io6WxnSt6zVFnE5M9Gj5eWfaEz4D5QpXKiaqdD5PtRaUz3U")' }}
                                    ></div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-white"></span> ONLINE
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h1 className="text-slate-900 text-2xl md:text-3xl font-bold leading-tight">Dr. Sarah Smith, MD</h1>
                                        <p className="text-slate-500 text-base font-medium mt-1">Senior Cardiologist</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                            <span>15 Years Experience</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <span>New York Presbyterian</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                            <span className="font-bold text-slate-900">4.9</span>
                                            <span className="text-slate-400">(1,240 Reviews)</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">English</span>
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">Spanish</span>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition-colors">
                                        <MessageCircle className="w-5 h-5" /> Message
                                    </button>
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition-colors">
                                        <Share2 className="w-5 h-5" /> Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-slate-900 text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" /> About Dr. Smith
                            </h3>
                            <div className="text-slate-600 leading-relaxed space-y-4">
                                <p>Dr. Sarah Smith is a board-certified cardiologist specializing in preventative cardiology and heart failure management. She is dedicated to providing personalized care that focuses on long-term heart health.</p>
                                <p>She received her medical degree from <strong className="text-slate-900">Harvard Medical School</strong> and completed her residency at <strong className="text-slate-900">Johns Hopkins</strong>. With over 15 years of clinical experience, Dr. Smith has published numerous research papers on cardiovascular health and is an active member of the American College of Cardiology.</p>
                            </div>
                        </div>

                        {/* Services Offered */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-primary" /> Services & Treatments
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="bg-blue-50 text-blue-600 rounded-lg p-2 mt-0.5 flex-shrink-0">
                                        <HeartPulse className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Cardiac Consultation</h4>
                                        <p className="text-slate-500 text-xs mt-1">Comprehensive heart health assessment.</p>
                                        <span className="inline-block mt-2 text-primary text-xs font-bold">$150</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="bg-rose-50 text-rose-600 rounded-lg p-2 mt-0.5 flex-shrink-0">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Echocardiogram</h4>
                                        <p className="text-slate-500 text-xs mt-1">Ultrasound imaging of the heart.</p>
                                        <span className="inline-block mt-2 text-primary text-xs font-bold">$300</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="bg-emerald-50 text-emerald-600 rounded-lg p-2 mt-0.5 flex-shrink-0">
                                        <PersonStanding className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Stress Testing</h4>
                                        <p className="text-slate-500 text-xs mt-1">Evaluation of heart function under stress.</p>
                                        <span className="inline-block mt-2 text-primary text-xs font-bold">$220</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="bg-purple-50 text-purple-600 rounded-lg p-2 mt-0.5 flex-shrink-0">
                                        <Droplets className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Hypertension Management</h4>
                                        <p className="text-slate-500 text-xs mt-1">Ongoing care for high blood pressure.</p>
                                        <span className="inline-block mt-2 text-primary text-xs font-bold">$120</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
                                <div className="bg-slate-900 p-5 text-white">
                                    <h3 className="text-lg font-bold">Book Appointment</h3>
                                    <p className="text-slate-300 text-sm mt-1">Select a time slot to continue</p>
                                </div>
                                <div className="p-6">
                                    {/* Date Selector */}
                                    <div className="flex items-center justify-between mb-6">
                                        <button className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <div className="text-center">
                                            <span className="block text-sm font-bold text-slate-900">September 2023</span>
                                        </div>
                                        <button className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors">
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Horizontal Date Scroll */}
                                    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                                        {[
                                            { day: 'Mon', date: 18 }, { day: 'Tue', date: 19, active: true },
                                            { day: 'Wed', date: 20 }, { day: 'Thu', date: 21 }, { day: 'Fri', date: 22 }
                                        ].map(({ day, date, active }) => (
                                            <button
                                                key={date}
                                                className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-lg transition-all ${active
                                                        ? 'bg-primary text-white shadow-md scale-105'
                                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:bg-blue-50'
                                                    }`}
                                            >
                                                <span className={`text-xs font-medium ${active ? 'opacity-90' : ''}`}>{day}</span>
                                                <span className="text-lg font-bold">{date}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Time Slots */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Morning</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'].map((slot, i) => (
                                                    <button
                                                        key={slot}
                                                        disabled={i === 2}
                                                        className={`px-2 py-2 rounded border text-sm font-medium transition-colors ${i === 4
                                                                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                                : i === 2
                                                                    ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed line-through'
                                                                    : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:bg-blue-50'
                                                            }`}
                                                    >{slot}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Afternoon</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'].map((slot, i) => (
                                                    <button
                                                        key={slot}
                                                        disabled={i === 3}
                                                        className={`px-2 py-2 rounded border text-sm font-medium transition-colors ${i === 3
                                                                ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed line-through'
                                                                : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:bg-blue-50'
                                                            }`}
                                                    >{slot}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <Link
                                            href={`/book/${providerId}`}
                                            className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold shadow-md hover:bg-primary-hover transition-all active:scale-95"
                                        >
                                            Book Appointment
                                        </Link>
                                        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                                            <Lock className="w-4 h-4" /> Secure booking powered by BookWell
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-50">
                                    <h3 className="text-slate-900 font-bold flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" /> Location
                                    </h3>
                                </div>
                                <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyHJbWkka2-Sb0h16mcwKlVK2njdG1l3JBdMrFm39Ctd5iKVVlAYwQYhRD7WXolXhjqjpieEJpf-vWl2QvK61FkuZqPmV-WTgOshlNFbbu-eCniRwf30Ez4qP4cjbqDZ135-LNnDx2g6zdHVL4zrIgtManKWjtNxq0ezEqBasZD0gNvCOYpXFTa1uaMJBRcM7MCMNrBViGv0cjVLDETN8jttmJn16hw0Fgw5TrYjp9ECZ69077jL5pV5XsMZOixxmUQRN_scuY0kU"
                                        alt="Map"
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-medium text-slate-900">New York Presbyterian Hospital</p>
                                    <p className="text-sm text-slate-500 mt-1">525 E 68th St, New York, NY 10065</p>
                                    <button className="mt-3 w-full py-2 text-primary text-sm font-bold border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t border-slate-200 bg-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Link href="/" className="flex items-center gap-3 text-slate-900">
                        <div className="flex items-center justify-center rounded-lg bg-blue-50 p-2 text-primary">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold">BookWell</span>
                    </Link>
                    <div className="text-slate-500 text-sm">© 2023 BookWell Inc. All rights reserved.</div>
                    <div className="flex gap-4">
                        <Link href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Privacy</Link>
                        <Link href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
