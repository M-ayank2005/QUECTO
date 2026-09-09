'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Smartphone,
  ChevronRight,
  Search,
} from 'lucide-react';
import { fetchShops, Shop } from '../lib/api';
import ShopCard from '../components/ShopCard';

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchLocation, setSearchLocation] = useState('Lucknow');

  useEffect(() => {
    fetchShops().then((data) => setShops(data.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-24 py-4">
      {/* Hero Section with 3D Glass Card */}
      <section className="relative pt-6 sm:pt-12">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
          {/* Inner ambient specular glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 space-y-7">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hyperlocal Community Commerce • Lucknow</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Discover & support your <br />
              <span className="text-emerald-400">
                neighborhood stores.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Order fresh groceries, daily milk, farm produce, and medicines directly from trusted local shopkeepers. 
              Zero monopoly platform surcharges, merchant-controlled delivery, and an inclusive experience for every family member.
            </p>

            {/* Search & Location Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter your street or neighborhood..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-sm font-medium placeholder:text-slate-500"
                />
              </div>

              <Link
                href="/shops"
                className="glass-button-primary px-6 py-3.5 rounded-2xl text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Find Stores</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Merchant Gateway Quick Hint */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Are you a store owner?</span>
              <Link
                href="/register-shop"
                className="text-emerald-400 font-bold hover:underline"
              >
                Register Your Shop
              </Link>
              <span>•</span>
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white font-semibold hover:underline"
              >
                Shopkeeper Admin Login →
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Predatory Surcharges</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Local Kirana Autonomy</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Elderly & Community Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 3D Interactive Cards */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
            Frictionless & Direct
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Quecto Works
          </h2>
          <p className="text-sm text-slate-400">
            A seamless bridge between your doorstep and the neighborhood shopkeeper you already trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg shadow-inner">
              01
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Locate Your Neighborhood
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect your location or enter your locality to see verified grocery, dairy, bakery, and produce stores within 1-3 kilometers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-lg shadow-inner">
              02
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
              Browse Genuine Local Catalogs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick items directly from the store inventory at genuine market rates without inflated dark-store markups.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg shadow-inner">
              03
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Direct Merchant Delivery
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The shopkeeper packages and fulfills your order directly. Pay upon delivery via cash or direct UPI QR code.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stores Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Neighborhood Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Stores Open Near You
            </h2>
          </div>
          <Link
            href="/shops"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Nearby Stores</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* The Quecto Advantage: Glass Comparison Section */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Why Quecto Outperforms Monopolistic Apps
          </h2>
          <p className="text-xs text-slate-400">
            Contrasting rapid dark-store giants with community-driven commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick-Commerce Giants */}
          <div className="p-6 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Big-Tech Dark Stores</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Steep delivery & handling fees on every single basket</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Destroys neighborhood kirana stores and local livelihoods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Surge pricing during rain, peak hours, and festivals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Impersonal algorithms with zero customer-merchant trust</span>
              </li>
            </ul>
          </div>

          {/* Quecto Approach */}
          <div className="p-6 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/30 space-y-4 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>The Quecto Platform</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Transparent, competitive delivery fees (often completely FREE above ₹149)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Empowers local shopkeepers with a digital storefront and delivery ownership</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero surge pricing; prices set fairly by local retailers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Full support for elderly and disabled residents with assisted delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Role Cards: Customers vs Store Owners */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* For Customers */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">For Community Residents</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Order fresh pantry essentials, spices, bread, dairy, and farm vegetables directly from your local market. 
              Enjoy transparent delivery notes, senior citizen assisted delivery, and flexible payment options.
            </p>
          </div>
          <Link
            href="/shops"
            className="glass-button-primary px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 self-start"
          >
            <span>Explore Stores Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* For Store Owners */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">For Local Shopkeepers</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Take your store online in minutes. Manage incoming orders, customize delivery charges, update product stock in real time, and expand your community reach with zero commission fees.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <Link
              href="/register-shop"
              className="glass-button-primary px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Register Your Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl glass-button-secondary text-slate-300 hover:text-white font-semibold text-xs text-center"
            >
              <span>Merchant Admin Login →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Community Inclusivity Banner */}
      <section className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Community First Mission
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Designed for Inclusivity & Elderly Support
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Need phone-assisted orders or specific delivery instructions (e.g. ringing bell twice, carrying items upstairs)? 
            Our shopkeepers know the neighborhood and take personalized care of elderly and disabled residents.
          </p>
        </div>

        <Link
          href="/about"
          className="glass-button-secondary px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-2 shrink-0"
        >
          <span>Read Our Mission</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
