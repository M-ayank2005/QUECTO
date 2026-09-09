'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  MapPin,
  Phone,
  Truck,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight,
  Sparkles,
  Plus,
  X,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { registerShop } from '../../lib/api';

const CATEGORIES = ['Groceries', 'Dairy & Bakery', 'Fruits & Vegetables', 'Pharmacy'];
const DEFAULT_SOCIETIES = ['Royal Palms', 'Parsvnath Planet', 'Eldeco Elegance', 'Rohtas Presidential', 'Gomti Enclave'];

export default function RegisterShopPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Groceries',
    address: '',
    city: 'Lucknow',
    phone: '',
    delivery_radius_km: 3.5,
    served_apartments: DEFAULT_SOCIETIES,
    upi_id: '',
    owner_name: '',
    owner_email: '',
    password: '',
  });

  const [newApartment, setNewApartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdShop, setCreatedShop] = useState<any | null>(null);

  const handleAddApartment = () => {
    if (!newApartment.trim()) return;
    if (!formData.served_apartments.includes(newApartment.trim())) {
      setFormData({
        ...formData,
        served_apartments: [...formData.served_apartments, newApartment.trim()],
      });
    }
    setNewApartment('');
  };

  const handleRemoveApartment = (apt: string) => {
    setFormData({
      ...formData,
      served_apartments: formData.served_apartments.filter((a) => a !== apt),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerShop(formData);
      setCreatedShop(res);
    } catch (err: any) {
      setError(err.message || 'Failed to register store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hyperlocal Kirana Onboarding Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Register Your Store with Quecto
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Take your kirana, pharmacy, or produce business online. Zero monopoly commissions, retain full delivery and pricing autonomy, and connect directly with local apartment residents.
        </p>
      </div>

      {/* Success View */}
      {createdShop ? (
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-emerald-500/30 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Store Successfully Registered!</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your store <strong className="text-emerald-300">{createdShop.shop?.name}</strong> is now live on Quecto and discoverable by neighborhood customers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Assigned Store ID:</span>
              <strong className="text-white font-mono">{createdShop.shop?.id}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Merchant Login Email:</span>
              <strong className="text-white font-mono">{createdShop.user?.email}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Service Radius:</span>
              <strong className="text-emerald-400">{createdShop.shop?.delivery_radius_km} KM</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-2xl glass-button-primary text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              <span>Launch Your Merchant Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/shops"
              className="px-6 py-3.5 rounded-2xl glass-button-secondary text-slate-300 hover:text-white font-bold text-xs w-full sm:w-auto text-center"
            >
              View on Consumer Storefront
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Business Profile */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-white/10">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>1. Store Profile & Category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Awadh Organic Spices & Dry Fruits"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Store Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Store WhatsApp / Mobile *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91-9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Lucknow"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Full Store Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Shop 14, Main Market, Gomti Nagar"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery & Service Boundary */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-white/10">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>2. Delivery Radius & Served Societies</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
                  <span>Delivery Radius: {formData.delivery_radius_km} KM</span>
                  <span className="text-[11px] text-slate-400">Max distance your store dispatches</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={formData.delivery_radius_km}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_radius_km: parseFloat(e.target.value) })
                  }
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 KM</span>
                  <span>5 KM</span>
                  <span>10 KM</span>
                  <span>15 KM</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Apartment Complexes & Gated Societies Served:
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {formData.served_apartments.map((apt) => (
                    <span
                      key={apt}
                      className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>{apt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveApartment(apt)}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={newApartment}
                    onChange={(e) => setNewApartment(e.target.value)}
                    placeholder="Add society name (e.g. Shalimar Gallant)"
                    className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddApartment}
                    className="px-4 py-2 rounded-xl glass-button-secondary text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  UPI VPA ID (For Instant Direct Customer Payments) *
                </label>
                <div className="relative max-w-md">
                  <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.upi_id}
                    onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                    placeholder="e.g. storename@okicici or 9876543210@paytm"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Owner Account & Admin Credentials */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Store Owner & Admin Login Credentials</span>
            </div>
            <p className="text-[11px] text-slate-400">
              These credentials will be strictly authorized to access your private Merchant Admin Dashboard on Port 3001.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Owner Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    placeholder="e.g. Rajesh Gupta"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Admin Login Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.owner_email}
                    onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                    placeholder="owner@quecto.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Admin Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl glass-button-primary text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-xl"
          >
            <span>{loading ? 'Submitting Registration...' : 'Complete Registration & Activate Store'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
