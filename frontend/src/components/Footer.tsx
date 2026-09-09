'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Heart, Mail, Phone, MapPin, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-white/10 relative overflow-hidden bg-slate-950/80">
      {/* Ambient background glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">QUECTO</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering local neighborhood commerce, supporting local livelihoods against monopoly platforms, and offering inclusive daily essential delivery for everyone.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hyperlocal • Fair Pricing • Zero Surge</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/shops" className="hover:text-emerald-400 transition-colors">Nearby Grocery & Kirana</Link>
              </li>
              <li>
                <Link href="/shops?category=Dairy" className="hover:text-emerald-400 transition-colors">Fresh Dairy & Bakeries</Link>
              </li>
              <li>
                <Link href="/shops?category=Vegetables" className="hover:text-emerald-400 transition-colors">Farm Fresh Produce</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">Our Mission & Inclusivity</Link>
              </li>
            </ul>
          </div>

          {/* Shopkeeper Portal & Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">For Merchants</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/register-shop"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium text-emerald-300"
                >
                  <span>Register Your Kirana Store</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Onboard</span>
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium text-slate-300"
                >
                  <span>Shopkeeper Admin Portal</span>
                  <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded font-bold">Admin</span>
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Partner With Quecto</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Join</span>
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Store Onboarding: Open to all Kirana shops</span>
              </li>
              <li>
                <span className="text-slate-400">Zero Commission on Deliveries</span>
              </li>
              <li>
                <span className="text-slate-400">Direct Customer Connection</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Help & Community</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:quecto@gmail.com" className="hover:text-emerald-400 transition-colors">
                  quecto@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91-9369831243</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lucknow, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Local Stores Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Quecto. Developed by The Quecto Team.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for local neighborhood empowerment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
