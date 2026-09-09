'use client';

import React, { useState } from 'react';
import {
  Settings,
  Store,
  MapPin,
  Phone,
  Clock,
  Truck,
  QrCode,
  ShieldCheck,
  Save,
  CheckCircle2,
  Globe,
  Building2,
  Eye,
  Plus,
  X,
  Lock,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { updateShopPassword } from '../../lib/api';

export default function AdminSettingsPage() {
  const { merchant } = useAdminAuth();
  const [saved, setSaved] = useState(false);
  const [newApartment, setNewApartment] = useState('');

  // Password management state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const [storeData, setStoreData] = useState({
    name: 'Gupta General & Kirana Store',
    category: 'Groceries',
    phone: '+91-9876543210',
    address: '12/4 Manoj Pandey Chauraha, Gomti Nagar',
    city: 'Lucknow',
    minOrder: '149',
    deliveryFee: '15',
    freeThreshold: '199',
    radiusKm: '3.5',
    visibility: 'public', // 'public' or 'neighborhood_only'
    servedApartments: [
      'Royal Palms',
      'Parsvnath Planet',
      'Eldeco Elegance',
      'Rohtas Presidential',
      'Gomti Enclave',
    ],
    upiId: 'guptakirana@okicici',
    openingHours: '07:00 AM - 10:30 PM',
  });

  const handleAddApartment = () => {
    if (!newApartment.trim()) return;
    if (!storeData.servedApartments.includes(newApartment.trim())) {
      setStoreData({
        ...storeData,
        servedApartments: [...storeData.servedApartments, newApartment.trim()],
      });
    }
    setNewApartment('');
  };

  const handleRemoveApartment = (apt: string) => {
    setStoreData({
      ...storeData,
      servedApartments: storeData.servedApartments.filter((a) => a !== apt),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match. Please re-type.');
      return;
    }

    setPassLoading(true);
    const res = await updateShopPassword(oldPassword, newPassword);
    setPassLoading(false);

    if (res.success) {
      setPassSuccess('Store password successfully changed and hashed with bcrypt in the database! Use your Shop ID and new password next time you log in.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(res.message || 'Failed to update store password.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Store Visibility & Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure customer discovery, served residential societies, delivery radius, and pricing autonomy.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Visibility parameters and delivery settings updated successfully!</span>
        </div>
      )}

      {/* Store Password & Security Protection Card */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Store Access & Password Protection</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
            Shop ID: #{merchant?.shop_id || 'shop-1'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your admin panel is protected with a password. To access this dashboard, store managers must enter their <strong>Shop ID ({merchant?.shop_id || 'shop-1'})</strong> and secret password. You can change your password below; it is stored as a secure cryptographic hash in the database.
        </p>

        {passSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{passLoading ? 'Updating Hash...' : 'Update & Hash Store Password'}</span>
          </button>
        </form>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">

        {/* Store Visibility & Discovery Mode */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Store Visibility & Customer Discovery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setStoreData({ ...storeData, visibility: 'public' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                storeData.visibility === 'public'
                  ? 'glass-pill-active border-emerald-500'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Public & Broad Search</span>
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your store is visible to immediate neighborhood customers and also appears when customers use <strong>"Search Broader Area"</strong> across Lucknow.
              </p>
            </div>

            <div
              onClick={() => setStoreData({ ...storeData, visibility: 'neighborhood_only' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                storeData.visibility === 'neighborhood_only'
                  ? 'glass-pill-active border-emerald-500'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Neighborhood Only</span>
                <Building2 className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your store is strictly visible to residents within your immediate delivery radius and specified apartment complexes.
              </p>
            </div>
          </div>
        </div>

        {/* Served Residential Apartments & Societies */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Served Apartment Complexes & Societies</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Customers in these societies see your shop as their primary direct local provider with guaranteed delivery.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {storeData.servedApartments.map((apt) => (
              <span
                key={apt}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
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

          {/* Add apartment input */}
          <div className="flex items-center gap-2 max-w-md pt-2">
            <input
              type="text"
              value={newApartment}
              onChange={(e) => setNewApartment(e.target.value)}
              placeholder="Add apartment or society name..."
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

        {/* Delivery & Pricing Autonomy */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Delivery Radius & Fees</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Delivery Radius: {storeData.radiusKm} KM
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={storeData.radiusKm}
                onChange={(e) => setStoreData({ ...storeData, radiusKm: e.target.value })}
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
              <label className="block text-slate-300 mb-1 font-medium">Free Delivery Above (₹)</label>
              <input
                type="number"
                value={storeData.freeThreshold}
                onChange={(e) => setStoreData({ ...storeData, freeThreshold: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Base Delivery Fee (₹)</label>
              <input
                type="number"
                value={storeData.deliveryFee}
                onChange={(e) => setStoreData({ ...storeData, deliveryFee: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Minimum Order (₹)</label>
              <input
                type="number"
                value={storeData.minOrder}
                onChange={(e) => setStoreData({ ...storeData, minOrder: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Store Identity & Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Store Name</label>
              <input
                type="text"
                value={storeData.name}
                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Contact Phone</label>
              <input
                type="text"
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 mb-1 font-medium">Store Address & Locality</label>
              <input
                type="text"
                value={storeData.address}
                onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 mb-1 font-medium">Merchant UPI VPA ID</label>
              <input
                type="text"
                value={storeData.upiId}
                onChange={(e) => setStoreData({ ...storeData, upiId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl glass-button-primary text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings & Publish Visibility</span>
        </button>
      </form>
    </div>
  );
}
