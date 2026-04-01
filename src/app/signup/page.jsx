'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Stethoscope as DoctorIcon, UserCircle } from 'lucide-react';

export default function SignUpPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('CUSTOMER');
    const [specialty, setSpecialty] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    specialty: role === 'PROVIDER' ? specialty : '',
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || 'Failed to create account');
                setLoading(false);
                return;
            }

            const dest = data?.user?.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/customer/bookings';
            router.push(dest);
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-10 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <Stethoscope className="w-9 h-9 text-primary" />
                        <h1 className="text-3xl font-black text-text-main">BookWell</h1>
                    </div>
                    <p className="text-text-sub text-sm">Create your account to get started</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {error && (
                        <div className="mb-5 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                        {/* Role Selector */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-text-main">I am a...</label>
                            <div className="grid grid-cols-2 gap-3">

                                
                                <button
                                    type="button"
                                    onClick={() => setRole('CUSTOMER')}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${role === 'CUSTOMER'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    <UserCircle className="w-7 h-7" />
                                    <span className="text-sm font-semibold">Patient</span>
                                    <span className="text-xs text-slate-500 text-center leading-tight">Browse & book services</span>
                                </button>


                                
                                <button
                                    type="button"
                                    onClick={() => setRole('PROVIDER')}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${role === 'PROVIDER'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    <DoctorIcon className="w-7 h-7" />
                                    <span className="text-sm font-semibold">Provider</span>
                                    <span className="text-xs text-slate-500 text-center leading-tight">List my services</span>
                                </button>
                            </div>
                        </div>





                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main">Full name</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="John Smith"
                                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm font-medium text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Specialty for providers */}
                        {role === 'PROVIDER' && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-text-main">Specialty</label>
                                <input
                                    type="text"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    placeholder="e.g. Physiotherapy, Chiropractic..."
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main">Email address</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm font-medium text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-text-main">Password</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Min. 6 characters"
                                    className="w-full rounded-xl border border-slate-200 pl-10 pr-11 py-3 text-sm font-medium text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold py-3 text-sm transition-colors disabled:opacity-70 mt-1"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-sub">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
