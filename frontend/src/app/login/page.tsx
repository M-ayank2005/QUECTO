'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginCustomer, signupCustomer } from '../../lib/api';

const RESIDENTIAL_SOCIETIES = [
  'Royal Palms',
  'Parsvnath Planet',
  'Eldeco Elegance',
  'Rohtas Presidential',
  'Indira Heights',
  'Alambagh Heights',
  'Gomti Enclave',
];

export default function CustomerAuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [society, setSociety] = useState('Royal Palms');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginCustomer(loginEmail, loginPassword);
      login(res.user, res.token);
      router.push('/shops');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signupCustomer({ name, email, phone, password, society });
      login(res.user, res.token);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/shops'), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoginEmail('customer@gmail.com');
    setLoginPassword('customer123');
    setLoading(true);
    try {
      const res = await loginCustomer('customer@gmail.com', 'customer123');
      login(res.user, res.token);
      router.push('/shops');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Customer Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-slate-400">
            {tab === 'signin'
              ? 'Sign in to access your order history, live deliveries, and saved apartments.'
              : 'Join Quecto to order from local stores with fair pricing & direct delivery.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-white/[0.04] p-1 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tab === 'signin'
                ? 'glass-pill-active text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tab === 'signup'
                ? 'glass-pill-active text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Customer
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl glass-button-primary text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Quecto'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="w-full py-2.5 rounded-xl glass-button-secondary text-slate-300 hover:text-white text-xs font-semibold text-center border border-white/10"
            >
              Use 1-Click Demo Customer Account
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Mobile Phone (for delivery SMS/call)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Residential Society / Apartment</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                >
                  {RESIDENTIAL_SOCIETIES.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Choose Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl glass-button-primary text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Customer Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-white/5 text-center text-xs text-slate-400">
          <span>Are you a shopkeeper or merchant? </span>
          <Link href="/register-shop" className="text-emerald-400 font-bold hover:underline">
            Register Your Store Here →
          </Link>
        </div>
      </div>
    </div>
  );
}
