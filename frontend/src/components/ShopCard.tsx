'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react';
import { Shop } from '../lib/api';

export default function ShopCard({ shop }: { shop: Shop }) {
  const isDeliverable = shop.is_deliverable ?? true;
  const distance = shop.distance_km !== undefined ? `${shop.distance_km.toFixed(1)} km` : 'Near you';

  return (
    <Link
      href={`/shops/${shop.id}`}
      className="glass-card rounded-2xl overflow-hidden group block border border-white/10 hover:border-emerald-500/40 transition-all duration-300 relative"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={shop.image_url}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/40" />

        {/* Category & Distance Pills */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-emerald-300">
            {shop.category}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-slate-200 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-cyan-400" />
            <span>{distance}</span>
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-1 text-xs font-bold text-amber-400 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{shop.rating.toFixed(1)}</span>
        </div>

        {/* Delivery Fee Flag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {shop.delivery_fee === 0 ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              Free Delivery
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
              ₹{shop.delivery_fee.toFixed(0)} Delivery
            </span>
          )}
          <span className="text-[11px] text-slate-300 font-medium">Min ₹{shop.min_order.toFixed(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
            {shop.name}
          </h3>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{shop.address}</span>
        </p>

        {/* Serviceability / Apartment match tag */}
        <div className="flex items-center gap-1.5 pt-1 text-[11px]">
          {isDeliverable ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct Apartment / Local Delivery</span>
            </span>
          ) : (
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <span>Extended Broad Search (Pickup / Extra Fee)</span>
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>15-25 Mins</span>
          </div>

          <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
