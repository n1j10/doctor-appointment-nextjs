import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
    Search, LayoutGrid, DollarSign, CalendarDays, MapPin,
    Star, ChevronRight, ChevronLeft, Heart, CreditCard, Stethoscope, LogOut, User
} from 'lucide-react';

async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from('users').select('name, role').eq('id', user.id).single();
    return profile;
}

async function getProviders() {

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('providers')
        .select(`id, specialty, bio, avatar_url, rating, review_count, users!inner(name), services(price)`)
        .order('rating', { ascending: false });
    if (error || !data) return [];
    return data.map((p) => {
        const prices = p.services?.map((s) => s.price) ?? [];

        return {
            id: p.id,
            name: p.users.name,
            specialty: p.specialty,
            bio: p.bio,
            avatarUrl: p.avatar_url,
            rating: p.rating,
            reviewCount: p.review_count,
            minPrice: prices.length ? Math.min(...prices) : null,
            maxPrice: prices.length ? Math.max(...prices) : null,
        };
    });
}

export default async function ProvidersPage() {
    const [user, providers] = await Promise.all([getUser(), getProviders()]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-slate-900 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:px-10 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3">
                        <Stethoscope className="w-8 h-8 text-primary" />
                        <h2 className="text-xl font-bold leading-tight tracking-tight">BookWell</h2>
                    </Link>
                    <div className="hidden md:flex w-full max-w-sm items-center rounded-lg bg-slate-100 px-3 py-2">
                        <Search className="w-5 h-5 text-slate-500" />
                        <input className="ml-2 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-500" placeholder="Search providers..." />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/providers" className="text-sm font-medium text-primary">Find Providers</Link>
                        {user && (
                            <Link href={user.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/customer/bookings'} className="text-sm font-medium hover:text-primary transition-colors">
                                {user.role === 'PROVIDER' ? 'My Dashboard' : 'My Appointments'}
                            </Link>
                        )}
                    </nav>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-sub">
                                    <User className="w-4 h-4" /> {user.name}
                                </span>
                                <Link href="/auth/signout" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">Log In</Link>
                                <Link href="/signup" className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-hover">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>














            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:flex-row md:p-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <div className="sticky top-24 rounded-xl bg-white p-5 shadow-sm border border-slate-100">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <p className="text-sm text-slate-500">Refine your search</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            {[
                                
                            //     {
                              
                            // icon: <LayoutGrid className="w-5 h-5" />,
                            //     label: 'Category',
                            //     href: '/providers',
                            //     active: true,
                            // },
                            
                            {
                                icon: <CalendarDays className="w-5 h-5" />,
                                label: 'Availability',
                                href: providers.length ? `/book/${providers[0].id}` : '/providers',
                                active: false,
                            }].map(({ icon, label, href, active }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${active ? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {icon}
                                    <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex flex-1 flex-col">
                    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link className="hover:text-primary hover:underline" href="/">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-medium text-slate-900">Specialists</span>
                    </nav>

                    <div className="relative mb-8 overflow-hidden rounded-xl bg-slate-900 shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent z-10" />
                        <div className="relative z-20 flex h-full min-h-[180px] flex-col justify-center px-8 py-6">
                            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Find the Best Specialists Near You</h1>
                            <p className="max-w-lg text-slate-300 text-sm md:text-base">Connect with top-rated professionals for your health and wellness needs.</p>
                        </div>
                        <div className="absolute inset-0 h-full w-full bg-cover bg-center opacity-60" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSHrXdqKtuCuZwkiv9yC0cCPALGVX7qbzTozJsh6Jx_tYrgWsrfFqUGGhX_iWK9V8xzkwx7xT_MYljv8hUcoCFjtljgvB5irup1QQfbcnxrNvM-KKE9N7EriiCwjDwVpgTeCpJcy2UK9YQtHRrCBCSnL2y6eApv0I0d5ALMDRAKC3LdBAVj9Z36WJwGla4K7jXnoHqL3UNI-jnRX0J0gUxWOLqgwr0T2_UcJ1TEa3rtTYmPtp6X5TGSZ6GVJLoBZDH3PLJGYJz9-4")' }} />
                    </div>

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Available Specialists
                            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-600">{providers.length}</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">Sort by:</span>
                            <select className="rounded-lg border-none bg-slate-100 py-1.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:ring-1 focus:ring-primary outline-none">
                                <option>Highest Rated</option>
                                <option>Price: Low to High</option>
                            </select>
                        </div>
                    </div>




                    {providers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Stethoscope className="w-12 h-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">No providers yet</h3>
                            <p className="text-slate-500 text-sm mt-1">Check back soon or sign up as a provider.</p>
                        </div>
                    ) : (

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">


                            {providers.map((provider) => (
                                <div key={provider.id} 
                                className="group flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30">

                                    <Link href={`/book/${provider.id}`} className="relative mb-4 h-48 w-full overflow-hidden rounded-lg block">
                                        {provider.avatarUrl ? (
                                            <img src={provider.avatarUrl} alt={provider.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                                <Stethoscope className="w-14 h-14 text-primary/40" />
                                            </div>
                                        )}
                                        <div className="absolute right-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                {provider.rating.toFixed(1)} ({provider.reviewCount})
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="mb-1 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg hover:text-primary transition-colors">
                                                <Link href={`/book/${provider.id}`}>{provider.name}</Link>
                                            </h3>
                                            <p className="text-sm text-primary font-medium">{provider.specialty}</p>
                                        </div>
                                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="mb-4 text-sm text-slate-500 line-clamp-2">{provider.bio}</p>
                                    
                                    <div className="mt-auto flex flex-col gap-3">
                                        {provider.minPrice && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <CreditCard className="w-4 h-4" />
                                                <span>${provider.minPrice}{provider.maxPrice && provider.maxPrice !== provider.minPrice ? ` – $${provider.maxPrice}` : ''} / session</span>
                                            </div>
                                        )}
                                        <Link href={`/book/${provider.id}`} className="mt-2 w-full flex items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>


                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
