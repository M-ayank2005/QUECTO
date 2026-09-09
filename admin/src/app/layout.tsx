'use client';

import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Settings,
  ExternalLink,
  Power,
  ShieldCheck,
  Sparkles,
  Lock,
  LogOut,
  ArrowRight,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { merchant, isLoading, isSuperAdmin, login, masterLogin, logout } = useAdminAuth();
  const [storeOpen, setStoreOpen] = useState(true);

  // Login form state
  const [loginMode, setLoginMode] = useState<'store' | 'master'>('store');
  const [shopId, setShopId] = useState('shop-1');
  const [password, setPassword] = useState('');
  const [masterPassInput, setMasterPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const baseLinks = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Orders Pipeline', href: '/orders', icon: ShoppingBag },
    { label: 'Stock & Inventory', href: '/inventory', icon: Boxes },
    { label: 'Store Settings', href: '/settings', icon: Settings },
  ];

  const links = isSuperAdmin
    ? [{ label: 'Quecto HQ Console', href: '/hq', icon: Building2, highlight: true }, ...baseLinks]
    : baseLinks;

  const handleStoreLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const res = await login(shopId, password);
    setSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Invalid Shop ID or password.');
    }
  };

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const res = await masterLogin(masterPassInput);
    setSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Invalid Quecto HQ Master Password.');
    }
  };

  const handleQuickStoreLogin = async (sId: string, sPass: string) => {
    setShopId(sId);
    setPassword(sPass);
    setAuthError('');
    setSubmitting(true);
    const res = await login(sId, sPass);
    setSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Invalid shopkeeper credentials.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 glass-panel px-6 py-4 rounded-2xl border border-white/10">
          <Store className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="text-xs font-bold text-slate-300">Verifying authorization clearance...</span>
        </div>
      </div>
    );
  }

  // If not logged in, display the Secure Login Wall
  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-950">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Operations Gateway</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              {loginMode === 'store' ? 'Shopkeeper Store Login' : 'Quecto HQ Master Login'}
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {loginMode === 'store'
                ? 'Enter your assigned Shop ID and password to access your store workspace.'
                : 'Quecto Core Operations Team clearance. Protected by environment security key.'}
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.05] border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('store');
                setAuthError('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                loginMode === 'store'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('master');
                setAuthError('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                loginMode === 'master'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Quecto Team HQ</span>
            </button>
          </div>

          {/* Error notice */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* MODE 1: Store Login (Shop ID + Password) */}
          {loginMode === 'store' ? (
            <form onSubmit={handleStoreLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Store / Shop ID
                </label>
                <input
                  type="text"
                  required
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  placeholder="e.g. shop-1, shop-2, shop-5"
                  className="w-full px-3.5 py-3 rounded-xl glass-input text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Format: <code>shop-1</code>, <code>shop-2</code>, etc. (Or registered merchant email)
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Store Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl glass-button-primary text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>{submitting ? 'Verifying...' : 'Unlock Store Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* MODE 2: Quecto Team Master Login */
            <form onSubmit={handleMasterLogin} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 leading-relaxed">
                Superadmin clearance unlocks full cross-store surveillance, global order radar, user directories, and universal DB troubleshooting.
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Quecto HQ Master Password
                </label>
                <input
                  type="password"
                  required
                  value={masterPassInput}
                  onChange={(e) => setMasterPassInput(e.target.value)}
                  placeholder="Password configured in env (QUECTO_ADMIN_PASSWORD)"
                  className="w-full px-3.5 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl glass-button-primary text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>{submitting ? 'Authenticating Master...' : 'Unlock Quecto HQ Console'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Logins for Shopkeepers */}
          {loginMode === 'store' && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block text-center">
                Quick 1-Click Shopkeeper Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickStoreLogin('shop-1', 'admin123')}
                  className="p-2 rounded-xl glass-card border border-white/10 hover:border-emerald-500/40 text-left text-slate-300 hover:text-white transition-all"
                >
                  <div className="font-bold text-emerald-400 line-clamp-1">Gupta Kirana</div>
                  <div className="text-[10px] text-slate-500">ID: shop-1 (Groceries)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStoreLogin('shop-2', 'admin123')}
                  className="p-2 rounded-xl glass-card border border-white/10 hover:border-emerald-500/40 text-left text-slate-300 hover:text-white transition-all"
                >
                  <div className="font-bold text-teal-400 line-clamp-1">Awadh Dairy</div>
                  <div className="text-[10px] text-slate-500">ID: shop-2 (Dairy)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStoreLogin('shop-3', 'admin123')}
                  className="p-2 rounded-xl glass-card border border-white/10 hover:border-emerald-500/40 text-left text-slate-300 hover:text-white transition-all"
                >
                  <div className="font-bold text-lime-400 line-clamp-1">Kisan Mandi</div>
                  <div className="text-[10px] text-slate-500">ID: shop-3 (Produce)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStoreLogin('shop-4', 'admin123')}
                  className="p-2 rounded-xl glass-card border border-white/10 hover:border-emerald-500/40 text-left text-slate-300 hover:text-white transition-all"
                >
                  <div className="font-bold text-cyan-400 line-clamp-1">Sanjeevani Med</div>
                  <div className="text-[10px] text-slate-500">ID: shop-4 (Pharmacy)</div>
                </button>
              </div>
            </div>
          )}

          {/* New Store Registration Link */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
            <span>Want to onboard a new store? </span>
            <a
              href="http://localhost:3000/register-shop"
              className="text-emerald-400 font-bold hover:underline"
            >
              Register Your Shop with Quecto →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Merchant Workspace
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col justify-between p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          {/* Merchant Brand & Store Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                {isSuperAdmin ? <ShieldCheck className="w-5 h-5 text-white" /> : <Store className="w-5 h-5 text-white" />}
              </div>
              <div className="min-w-0">
                <span className="text-lg font-black tracking-wider text-white block truncate">
                  {isSuperAdmin ? 'QUECTO HQ' : 'QUECTO'}
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-emerald-400 font-extrabold -mt-1">
                  {isSuperAdmin ? 'Master Operations' : 'Merchant Portal'}
                </span>
              </div>
            </div>

            {/* Active Shop Badge */}
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-0.5">
              <div className="text-[11px] font-bold text-white line-clamp-1">
                {merchant.name}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{isSuperAdmin ? 'Clearance: Level 5' : `Store ID: #${merchant.shop_id}`}</span>
                <span className={`px-1.5 py-0.2 rounded font-semibold ${isSuperAdmin ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {isSuperAdmin ? 'HQ Superadmin' : 'Active Store'}
                </span>
              </div>
            </div>
          </div>

          {/* Store Status Toggle */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Store Status</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    storeOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className={`font-bold text-[11px] ${storeOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {storeOpen ? 'Accepting Orders' : 'Store Paused'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setStoreOpen(!storeOpen)}
              className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                storeOpen
                  ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{storeOpen ? 'Pause Store' : 'Open Store Now'}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <link.icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer & Logout */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all"
          >
            <span>Consumer View</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          >
            <span>Lock & Sign Out</span>
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
          </button>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Merchant Admin</span>
            <span className="text-emerald-400 font-semibold">Quecto Team</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden glass-panel border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-white text-sm line-clamp-1">{merchant.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <Link href="/hq" className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
                HQ
              </Link>
            )}
            <Link href="/" className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-slate-200">
              Dashboard
            </Link>
            <Link href="/orders" className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300">
              Orders
            </Link>
            <button onClick={logout} className="text-xs px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300">
              Exit
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white overflow-x-hidden">
        {/* Ambient Lighting */}
        <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
        <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10" />

        <AdminAuthProvider>
          <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
