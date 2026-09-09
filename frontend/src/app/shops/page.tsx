'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  MapPin,
  Sparkles,
  Compass,
  Globe,
  CheckCircle2,
  Building2,
  Navigation,
} from 'lucide-react';
import { fetchShops, Shop } from '../../lib/api';
import ShopCard from '../../components/ShopCard';

const CATEGORIES = ['All', 'Groceries', 'Dairy & Bakery', 'Fruits & Vegetables', 'Pharmacy'];
const POPULAR_APARTMENTS = [
  'All Lucknow',
  'Royal Palms',
  'Parsvnath Planet',
  'Eldeco Elegance',
  'Rohtas Presidential',
  'Indira Heights',
  'Alambagh Heights',
];

export default function ShopsDirectoryPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('Royal Palms');
  const [isBroadSearch, setIsBroadSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apt = selectedApartment === 'All Lucknow' ? '' : selectedApartment;
    fetchShops(selectedCat, searchQuery, apt, isBroadSearch ? 15 : 3.5, isBroadSearch).then((res) => {
      setShops(res);
      setLoading(false);
    });
  }, [selectedCat, searchQuery, selectedApartment, isBroadSearch]);

  return (
    <div className="space-y-8 py-6">
      {/* Header & Location Controls */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Apartment & Society Local Delivery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Find Shops Delivering to Your Society
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Stores specifically configured by local shopkeepers to deliver directly to your apartment complex with zero dark-store surcharges.
          </p>
        </div>

        {/* Apartment Selector Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Your Apartment / Residential Society:</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {POPULAR_APARTMENTS.map((apt) => (
              <button
                key={apt}
                onClick={() => setSelectedApartment(apt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedApartment === apt
                    ? 'glass-pill-active text-white font-bold'
                    : 'glass-pill text-slate-300 hover:text-white'
                }`}
              >
                {apt}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Broader Area Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by item, name or street..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs"
            />
          </div>

          {/* Broad Search Toggle Button */}
          <button
            onClick={() => setIsBroadSearch(!isBroadSearch)}
            className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 border ${
              isBroadSearch
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'glass-button-secondary text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{isBroadSearch ? 'Broader Search: Active (15 KM)' : 'Search Broader Area'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'glass-pill-active text-white'
                  : 'glass-pill text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Notice Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            {isBroadSearch ? (
              <span>
                Showing extended stores across <strong>Lucknow (Broad Area)</strong>.
              </span>
            ) : (
              <span>
                Showing verified stores delivering to{' '}
                <strong className="text-emerald-300">
                  {selectedApartment === 'All Lucknow' ? 'Immediate Neighborhood' : selectedApartment}
                </strong>{' '}
                (&lt; 3.5 km).
              </span>
            )}
          </span>
        </div>

        {!isBroadSearch && (
          <button
            onClick={() => setIsBroadSearch(true)}
            className="text-emerald-400 hover:underline font-bold text-[11px] flex items-center gap-1"
          >
            <span>Want more options? Click to Search Broader Area →</span>
          </button>
        )}
      </div>

      {/* Shops Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white/[0.04] border border-white/5" />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <Store className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No shops found in immediate range</h3>
            <p className="text-xs text-slate-400">
              No store is currently registered within 3.5 km of {selectedApartment}. Try searching a broader area to see city-wide merchants!
            </p>
            <button
              onClick={() => setIsBroadSearch(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold glass-button-primary text-white"
            >
              Search Broader Area (15 KM)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
