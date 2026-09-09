'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Store,
  ShoppingBag,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  RefreshCw,
  Eye,
  Phone,
  MapPin,
  DollarSign,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  fetchMasterOverview,
  fetchMasterStores,
  fetchMasterOrders,
  fetchMasterUsers,
  searchTroubleshoot,
  overrideOrderStatus,
  MasterOverview,
  MasterStore,
  MasterUser,
  AdminOrder,
  TroubleshootResult,
} from '../../lib/api';

export default function QuectoHQPage() {
  const { merchant, isSuperAdmin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'troubleshoot' | 'stores' | 'orders' | 'users'>('troubleshoot');
  const [overview, setOverview] = useState<MasterOverview | null>(null);
  const [stores, setStores] = useState<MasterStore[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<MasterUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Universal Search & Troubleshooter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TroubleshootResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedUserOrders, setSelectedUserOrders] = useState<{ user: MasterUser; orders: AdminOrder[] } | null>(null);

  // Status override notification
  const [overrideMsg, setOverrideMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, st, ord, usr] = await Promise.all([
        fetchMasterOverview(),
        fetchMasterStores(),
        fetchMasterOrders(),
        fetchMasterUsers(),
      ]);
      setOverview(ov);
      setStores(st);
      setOrders(ord);
      setUsers(usr);
    } catch (e) {
      console.warn('Failed to load master HQ data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    const res = await searchTroubleshoot(searchQuery);
    setSearchResults(res);
    setSearching(false);
  };

  const handleInspectCustomerHistory = (user: MasterUser) => {
    const userOrds = orders.filter(
      (o) =>
        (o as any).customer_email?.toLowerCase() === user.email.toLowerCase() ||
        o.customer_phone === user.phone
    );
    setSelectedUserOrders({ user, orders: userOrds });
  };

  const handleOverrideStatus = async (orderId: string, newStatus: string) => {
    const updated = await overrideOrderStatus(orderId, newStatus);
    if (updated) {
      setOverrideMsg(`Order ${orderId} status successfully updated to ${newStatus}`);
      setTimeout(() => setOverrideMsg(''), 4000);
      loadData();
      if (searchQuery) handleSearch();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <span>QUECTO CORE OPERATIONS HQ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Platform Master Console & DB Troubleshooter
            </h1>
            <p className="text-xs text-slate-400">
              Complete multi-store visibility, global order surveillance, and customer issue resolution.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-xs font-bold text-slate-200 hover:text-white border border-white/10 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Sync DB</span>
        </button>
      </div>

      {/* Override Alert */}
      {overrideMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{overrideMsg}</span>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Kirana Stores</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {overview?.total_stores || stores.length || 4}
          </div>
          <p className="text-[11px] text-slate-400">Active local merchants in Lucknow</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {overview?.total_orders || orders.length || 0}
          </div>
          <p className="text-[11px] text-slate-400">
            {overview?.pending_orders || 0} pending processing
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Platform GMV</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{(overview?.total_revenue || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Cumulative order value</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {overview?.total_customers || users.length || 0}
          </div>
          <p className="text-[11px] text-slate-400">Buyers & neighborhood residents</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('troubleshoot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'troubleshoot'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white glass-card border-white/5'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>DB Search & Troubleshoot</span>
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stores'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white glass-card border-white/5'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-emerald-400" />
          <span>All Stores ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white glass-card border-white/5'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Global Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white glass-card border-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Users Registry ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: Universal DB Troubleshooter & Search */}
      {activeTab === 'troubleshoot' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Instant Database Search & Issue Troubleshooter</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quickly locate any record by Customer Email, Customer Name, Phone Number, Shop ID (e.g. <code>shop-1</code>), or Order ID (e.g. <code>ORD-1001</code>).
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. customer@gmail.com, shop-1, ORD-1001, +91-9876500000, Royal Palms..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-5 py-3 rounded-2xl glass-button-primary text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 active:scale-95"
              >
                <span>{searching ? 'Querying DB...' : 'Search Database'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
              <span className="text-slate-500 font-medium">Quick Troubleshoot Queries:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('customer@gmail.com');
                  setTimeout(() => searchTroubleshoot('customer@gmail.com').then(setSearchResults), 10);
                }}
                className="px-2.5 py-1 rounded-lg glass-card border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white"
              >
                Demo Customer Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('shop-1');
                  setTimeout(() => searchTroubleshoot('shop-1').then(setSearchResults), 10);
                }}
                className="px-2.5 py-1 rounded-lg glass-card border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white"
              >
                Gupta Kirana (shop-1)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('pending');
                  setTimeout(() => searchTroubleshoot('pending').then(setSearchResults), 10);
                }}
                className="px-2.5 py-1 rounded-lg glass-card border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white"
              >
                Pending Orders
              </button>
            </div>
          </div>

          {/* Search Results Display */}
          {searchResults && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Query: <strong>"{searchResults.query}"</strong> returned{' '}
                  <span className="text-emerald-400 font-bold">
                    {searchResults.users.length} Users
                  </span>
                  ,{' '}
                  <span className="text-teal-400 font-bold">
                    {searchResults.shops.length} Shops
                  </span>
                  ,{' '}
                  <span className="text-cyan-400 font-bold">
                    {searchResults.orders.length} Orders
                  </span>
                </span>
                <button
                  onClick={() => setSearchResults(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  Clear Results
                </button>
              </div>

              {/* Matched Users Card */}
              {searchResults.users.length > 0 && (
                <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Matched User Profiles</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.users.map((u) => (
                      <div
                        key={u.id}
                        className="p-4 rounded-2xl glass-card border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{u.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div>Email: <span className="text-slate-200">{u.email}</span></div>
                          <div>Phone: <span className="text-slate-200">{u.phone}</span></div>
                          {u.society && <div>Society: <span className="text-slate-200">{u.society}</span></div>}
                          {u.shop_id && <div>Linked Store: <span className="text-emerald-400 font-bold">#{u.shop_id}</span></div>}
                        </div>
                        <button
                          onClick={() => handleInspectCustomerHistory(u)}
                          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Complete Order History & Breakdown</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Order History Inspector Modal / Section */}
              {selectedUserOrders && (
                <div className="glass-panel rounded-3xl p-6 border border-emerald-500/40 space-y-4 bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        CUSTOMER ORDER HISTORY AUDIT
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {selectedUserOrders.user.name} ({selectedUserOrders.user.email})
                      </h3>
                      <p className="text-xs text-slate-400">
                        {selectedUserOrders.orders.length} order(s) placed across the Quecto platform.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedUserOrders(null)}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10"
                    >
                      Close Inspector
                    </button>
                  </div>

                  {selectedUserOrders.orders.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-2xl">
                      No order records found in DB for this customer profile.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedUserOrders.orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl glass-card border border-white/10 space-y-3 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                            <div>
                              <span className="font-bold text-white">Order #{ord.id}</span>
                              <span className="text-slate-400 text-[11px] ml-2">Store: #{ord.shop_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-400">₹{ord.total_amount}</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                                {ord.order_status}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-1">
                            <div>Address: <span className="text-slate-300">{ord.delivery_address}</span></div>
                            <div>Payment: <span className="text-slate-300">{ord.payment_method} ({ord.payment_status})</span></div>
                            {ord.notes && <div>Customer Notes: <span className="text-amber-300 italic">{ord.notes}</span></div>}
                          </div>

                          {/* Items */}
                          <div className="bg-slate-900/40 p-3 rounded-xl space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">Ordered Items:</span>
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                                <span>{item.quantity}x {item.product_name}</span>
                                <span className="font-bold">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Troubleshoot Override Status Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-slate-400 font-semibold">Troubleshoot Status:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleOverrideStatus(ord.id, st)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                    ord.order_status === st
                                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/40 hover:text-white'
                                  }`}
                                >
                                  {st.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Matched Orders Card */}
              {searchResults.orders.length > 0 && (
                <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-teal-400" />
                    <span>Matched Orders Pipeline</span>
                  </h3>
                  <div className="space-y-3">
                    {searchResults.orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl glass-card border border-white/10 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Order #{ord.id}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Store: #{ord.shop_id}</span>
                          </div>
                          <span className="font-bold text-emerald-400">₹{ord.total_amount}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div>Customer: <span className="text-slate-200">{ord.customer_name} ({ord.customer_phone})</span></div>
                          <div>Address: <span className="text-slate-200">{ord.delivery_address}</span></div>
                          <div>Status: <span className="text-emerald-400 font-bold uppercase">{ord.order_status}</span></div>
                        </div>

                        {/* Force Override Status */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-slate-400 font-bold">Ops Override:</span>
                          <div className="flex flex-wrap gap-1">
                            {['accepted', 'out_for_delivery', 'delivered'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleOverrideStatus(ord.id, st)}
                                className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10"
                              >
                                Mark {st.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Shops Card */}
              {searchResults.shops.length > 0 && (
                <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-cyan-400" />
                    <span>Matched Kirana Stores</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.shops.map((sh) => (
                      <div
                        key={sh.id}
                        className="p-4 rounded-2xl glass-card border border-white/10 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{sh.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            #{sh.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div>Category: <span className="text-slate-200">{sh.category}</span></div>
                          <div>Phone: <span className="text-slate-200">{sh.phone}</span></div>
                          <div>Address: <span className="text-slate-200">{sh.address}</span></div>
                          <div>Radius: <span className="text-slate-200">{sh.delivery_radius_km} km</span></div>
                          <div>Visibility: <span className="text-emerald-400 font-bold">{sh.visibility}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Stores Hub */}
      {activeTab === 'stores' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">All Registered Kirana Stores</h2>
              <p className="text-xs text-slate-400">
                Direct management view of all merchant storefronts active in Lucknow.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {stores.length} Stores Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((st) => (
              <div
                key={st.id}
                className="glass-card p-5 rounded-3xl border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{st.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        #{st.id}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{st.category} • {st.city}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      st.is_open
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {st.is_open ? 'Open & Taking Orders' : 'Paused'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300 line-clamp-1">{st.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300">{st.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Delivery Radius: <strong className="text-white">{st.delivery_radius_km} km</strong> • Visibility: <strong className="text-emerald-400 uppercase">{st.visibility}</strong></span>
                  </div>
                </div>

                {st.served_apartments && st.served_apartments.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Served Societies:</span>
                    <div className="flex flex-wrap gap-1">
                      {st.served_apartments.map((apt, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-slate-300 border border-white/5"
                        >
                          {apt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Global Orders Radar */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Platform-Wide Orders Radar</h2>
              <p className="text-xs text-slate-400">
                Live stream of customer orders placed across all merchant shops.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Total {orders.length} order(s)
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl glass-card border border-white/10 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Order #{ord.id}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-mono">
                      Store: #{ord.shop_id}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-emerald-400">₹{ord.total_amount}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                      {ord.order_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>
                    Customer: <strong className="text-white">{ord.customer_name}</strong> ({ord.customer_phone})
                  </div>
                  <div>
                    Delivery to: <span className="text-slate-300">{ord.delivery_address}</span>
                  </div>
                  <div>
                    Payment: <span className="text-slate-300 font-bold">{ord.payment_method}</span> ({ord.payment_status})
                  </div>
                  {ord.notes && (
                    <div className="italic text-amber-300">
                      Note: {ord.notes}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="bg-slate-900/40 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Items:</span>
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>{item.quantity}x {item.product_name}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Override */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold">Ops Force Override:</span>
                  <div className="flex flex-wrap gap-1">
                    {['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleOverrideStatus(ord.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                          ord.order_status === st
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Users Directory */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Complete Platform Users Registry</h2>
              <p className="text-xs text-slate-400">
                Database view of all consumer accounts, shop owners, and operations staff.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
              {users.length} Users in DB
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 text-[11px]">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Society / Store</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">{u.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'superadmin'
                            ? 'bg-amber-500/20 text-amber-300'
                            : u.role === 'admin'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.shop_id ? `Shop: #${u.shop_id}` : u.society || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role === 'customer' && (
                        <button
                          onClick={() => {
                            setActiveTab('troubleshoot');
                            setSearchQuery(u.email);
                            searchTroubleshoot(u.email).then(setSearchResults);
                            handleInspectCustomerHistory(u);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30"
                        >
                          Audit Orders →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
