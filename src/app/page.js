import Link from 'next/link';
import { Search, MapPin, CheckCircle2, CalendarDays, Star, CalendarCheck, Stethoscope, Menu, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from('users').select('name, role').eq('id', user.id).single();
    profile = data;
  }




  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-50 flex items-center gap-4 justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-surface-light px-6 py-4 lg:px-20 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 text-text-main">
            <div className="size-8 text-primary flex items-center justify-center">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-text-main text-xl font-bold leading-tight tracking-tight">BookWell</h2>
          </div>
          <div className="hidden lg:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">

              <Link href="/providers" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">Find A Doctor</Link>


              {profile ? (
                <>
                  <Link href={profile.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/customer/bookings'}

                   className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">

                    {profile.role === 'PROVIDER' ? 'My Dashboard' : 'My Appointments'}
                  </Link>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text-sub">
                    <User className="w-4 h-4" /> {profile.name}
                  </span>
                </>
              ) : (
                <Link href="/dashboard/provider" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">For Providers</Link>
              )}
            </div>
            {profile ? (
              <Link href="/auth/signout" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">Log In</Link>
                <Link href="/signup" 
                
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold leading-normal tracking-wide transition-colors">
                  <span className="truncate">Sign Up</span>
                </Link>
              </div>
            )}







          </div>
          <div className="lg:hidden">
            <button className="text-text-main p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>


        <main className="flex flex-col flex-1">
          {/* Hero Section */}

          <div className="px-6 lg:px-20 py-10 lg:py-20 flex justify-center bg-surface-light">
            <div className="flex flex-col lg:flex-row gap-12 max-w-[1280px] flex-1 items-center">
              {/* Hero Content */}

              <div className="flex flex-col gap-8 flex-1 w-full lg:max-w-[600px]">
                <div className="flex flex-col gap-4 text-left">
                  <span className="text-primary font-bold tracking-wider text-sm uppercase">Healthcare Simplified</span>
                  <h1 className="text-text-main text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
                    Book your next appointment in seconds
                  </h1>
                  <h2 className="text-text-sub text-lg lg:text-xl font-normal leading-relaxed">
                    Find the best doctors, dentists, and specialists near you. Read verified reviews and book instantly.
                  </h2>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col w-full shadow-lg rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <div className="flex flex-col md:flex-row w-full items-stretch h-auto md:h-16 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="flex flex-1 items-center px-4 py-3 md:py-0 bg-white hover:bg-slate-50 transition-colors group">
                      <Search className="w-5 h-5 text-text-sub group-focus-within:text-primary" />
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-text-main placeholder:text-text-sub px-3 text-base font-medium h-full"
                        placeholder="Doctor, condition, or procedure..."
                      />
                    </div>
                    <div className="flex flex-1 items-center px-4 py-3 md:py-0 bg-white hover:bg-slate-50 transition-colors group">
                      <MapPin className="w-5 h-5 text-text-sub group-focus-within:text-primary" />
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-text-main placeholder:text-text-sub px-3 text-base font-medium h-full"
                        placeholder="City, zip, or neighborhood"
                      />
                    </div>
                    <Link href="/providers" className="flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-8 py-4 md:py-0 font-bold text-base transition-colors md:min-w-[140px]">
                      Search
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-sub mt-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Verified Reviews
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Instant Booking
                  </span>
                </div>
              </div>





              {/* Hero Image */}
              <div className="w-full lg:w-1/2 flex justify-end">
                <div className="relative w-full aspect-[4/3] lg:aspect-square max-w-[500px] lg:max-w-none lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-opacity duration-300"></div>
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaFIdiQOlFnKhHHfcpX8_qkLoIS2Zmp-_6nZTaTEVv1kg5cEXI4wejlCTBeU9bQjBK0Hf1jOL5M3q3l4nfErJHVTsR3_jJlucPCBj1pS44ut8EFAnauCApYR2Px_z7jVkU1RP0uR-vtJDpXDAhGsKdV00W3knMMbTKXN007qTAVCgK-LKCWXKd4sH-ejd8RonZuYp5DLW7kooi_bvmOIiTojxigXj0fOCUWLoqiscbICOpFbm0JfYQyx-pzJKPeTy_zN66J9ktWik")' }}
                  ></div>

                  {/* Floating Card */}
                  <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:right-auto z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div className="pr-4">
                        <p className="text-sm font-bold text-text-main">Next Available</p>
                        <p className="text-xs text-text-sub font-medium">Today, 2:30 PM</p>
                      </div>
                      <div className="ml-auto pl-4 border-l border-slate-100">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>




          {/* Features Section */}
          <div className="flex flex-col px-6 lg:px-20 py-24 bg-background-light">
            <div className="max-w-[1280px] mx-auto w-full">
              <div className="flex flex-col gap-4 mb-16 text-center max-w-2xl mx-auto">
                <h2 className="text-text-main text-3xl lg:text-4xl font-bold leading-tight">
                  Why choose BookWell?
                </h2>
                <p className="text-text-sub text-lg bg-clip-text">
                  We streamline the healthcare experience, making it accessible, transparent, and easy for everyone.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-2 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Star className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-text-main text-xl font-bold">Verified Reviews</h3>
                    <p className="text-text-sub text-base leading-relaxed">Don't guess. Read real reviews from verified patients to find the right doctor who listens.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-2 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <CalendarCheck className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/book/02f9aecb-6906-4180-9b9e-57c07e142308" className="w-fit">
                      <h3 className="text-text-main text-xl font-bold hover:text-primary transition-colors">Instant Booking</h3>
                    </Link>
                    <p className="text-text-sub text-base leading-relaxed">Book appointments online instantly, 24/7. No more waiting on hold or playing phone tag.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-2 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/providers" className="w-fit">
                      <h3 className="text-text-main text-xl font-bold hover:text-primary transition-colors">Top Specialists</h3>
                    </Link>
                    <p className="text-text-sub text-base leading-relaxed">Access a vast network of top-rated specialists in your area for any condition.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

















          {/* Footer */}
          <footer className="bg-surface-light border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-text-main">
                    <Stethoscope className="w-6 h-6 text-primary" />
                    <h3 className="font-bold text-xl">BookWell</h3>
                  </div>
                  <p className="text-text-sub text-sm leading-relaxed">Simplifying healthcare access for everyone, everywhere. Your health, our priority.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-text-main">Company</h4>
                  <Link href="#" className="text-text-sub hover:text-primary transition-colors text-sm w-fit">About Us</Link>
                  <Link href="#" className="text-text-sub hover:text-primary transition-colors text-sm w-fit">Careers</Link>
                  <Link href="#" className="text-text-sub hover:text-primary transition-colors text-sm w-fit">Blog</Link>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-text-main">Support</h4>
                  <Link href="#" className="text-text-sub hover:text-primary transition-colors text-sm w-fit">Help Center</Link>
                  <Link href="#" className="text-text-sub hover:text-primary transition-colors text-sm w-fit">Contact Us</Link>
                  <Link href="#" className="text-text-sub hover:text-primary transition-colors text-sm w-fit">Privacy Policy</Link>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-text-main">Connect</h4>
                  <div className="flex gap-4">
                    <Link href="#" className="text-text-sub hover:text-primary transition-colors bg-slate-100 p-2 rounded-full hover:bg-blue-50">
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    </Link>
                    <Link href="#" className="text-text-sub hover:text-primary transition-colors bg-slate-100 p-2 rounded-full hover:bg-blue-50">
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-text-sub text-sm">© 2023 BookWell Inc. All rights reserved.</p>
                <div className="flex gap-6 text-sm text-text-sub">
                  <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
