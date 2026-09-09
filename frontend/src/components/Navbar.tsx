'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  MapPin,
  Store,
  HelpCircle,
  Compass,
  Menu,
  X,
  User as UserIcon,
  PackageCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('Lucknow - Gomti Nagar');

  const navLinks = [
    { label: 'Discover', href: '/', icon: Compass },
    { label: 'Nearby Shops', href: '/shops', icon: Store },
    { label: 'My Orders', href: '/orders', icon: PackageCheck },
    { label: 'About Quecto', href: '/about', icon: HelpCircle },
    { label: 'Contact', href: '/contact', icon: MapPin },
  ];

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all">
      <nav className="glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider text-white">
              QUECTO
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-emerald-400 font-semibold -mt-1">
              Local Commerce
            </span>
          </div>
        </Link>

        {/* Location Selector Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 hover:border-emerald-500/40 transition-colors cursor-pointer group">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-slate-200">{selectedLoc}</span>
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold ml-1 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Live
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions: Cart, User Auth & Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-all flex items-center gap-2 shadow-md active:scale-95"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md shadow-emerald-500/50">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Cart</span>
          </button>

          {/* Customer Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all flex items-center gap-2 text-xs font-bold"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <div className="px-3 py-2 border-b border-white/10 space-y-0.5">
                    <div className="font-bold text-white line-clamp-1">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] font-medium"
                  >
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 font-medium text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl glass-button-secondary text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 glass-panel rounded-2xl p-4 border border-white/10 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 p-2 text-xs text-slate-300 bg-white/[0.03] rounded-lg mb-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Delivering in: Lucknow</span>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <link.icon className="w-4 h-4 text-emerald-400" />
                {link.label}
              </div>
            </Link>
          ))}
          <Link
            href="/register-shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 text-center mt-2"
          >
            Register Your Kirana Store →
          </Link>
        </div>
      )}
    </header>
  );
}
