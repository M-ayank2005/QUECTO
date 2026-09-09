'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  ShieldCheck,
  Heart,
  Users,
  Target,
  Sparkles,
  Award,
  ArrowRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Commerce Reimagined</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About Quecto
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Quecto is dedicated to revolutionizing local shopping by empowering neighborhood kirana and grocery stores to thrive in the digital age without giving up their independence.
        </p>
      </section>

      {/* The Core Challenge & Our Mission */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Our Mission</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          While quick-commerce conglomerates deploy dark stores with exorbitant platform fees and exclusionary markups, neighborhood stores lose their competitive edge. Quecto reverses this trend by equipping local shopkeepers with a modern digital storefront, order management tools, and direct delivery autonomy.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          By eliminating the predatory middleman, local shops can offer fair, competitive pricing—often providing free delivery on everyday essentials—while retaining 100% of their earnings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs">
            <span className="font-bold text-emerald-400">Zero Commissions</span>
            <p className="text-slate-400 text-[11px]">Shopkeepers keep every rupee they earn from orders.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs">
            <span className="font-bold text-teal-400">Merchant Delivery</span>
            <p className="text-slate-400 text-[11px]">Stores manage deliveries directly with local staff.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs">
            <span className="font-bold text-cyan-400">Fair Local Rates</span>
            <p className="text-slate-400 text-[11px]">Free delivery above minimal neighborhood thresholds.</p>
          </div>
        </div>
      </section>

      {/* Inclusivity & Community Care */}
      <section className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Accessibility & Senior Citizen Care
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Quecto is engineered with community values at its heart. Unlike automated dark-store couriers who rush in seconds, neighborhood merchants have personal connections with community families. 
          Elderly and disabled individuals can request assisted delivery, gentle bell ringing, or direct phone ordering without technological barriers.
        </p>
      </section>

      {/* The Team */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">The Quecto Team</h2>
          <p className="text-xs text-slate-400">
            Conceived and developed with academic and technological rigor at IIIT Lucknow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">The Quecto Team</h3>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Engineering & Community Architecture
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Passionate researchers and software engineers committed to building equitable decentralized retail tools that keep local economies vibrant and connected.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Academic Origins</h3>
                <span className="text-[11px] text-teal-400 font-semibold">
                  IIIT Lucknow Research Initiative
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rooted in published research analyzing neighborhood supply chains, algorithmic fairness, and consumer empowerment in urban Indian ecosystems.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Have Questions or Want to Partner?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          We welcome shopkeepers, local associations, and community members to get in touch with us.
        </p>
        <div className="pt-2">
          <a
            href="mailto:quecto@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-primary text-white font-bold text-xs shadow-md shadow-emerald-500/30"
          >
            <Mail className="w-4 h-4" />
            <span>Email the Quecto Team (quecto@gmail.com)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
