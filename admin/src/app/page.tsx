'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Boxes,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Truck,
  Sparkles,
  Store,
} from 'lucide-react';
import { fetchAdminStats, fetchAdminOrders, updateOrderStatus, AdminStats, AdminOrder } from '../lib/api';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminDashboardPage() {
  const { merchant } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [s, ords] = await Promise.all([fetchAdminStats(), fetchAdminOrders()]);
    setStats(s);
    setRecentOrders(ords.slice(0, 5));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [merchant]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{merchant ? `${merchant.name} • #${merchant.shop_id}` : 'Quecto Merchant Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Merchant Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time live order stream, inventory balance, and community deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-bold text-white flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/orders"
            className="px-4 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Today's Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{stats ? stats.total_revenue.toFixed(2) : '---'}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">100% Direct Merchant Earning</p>
        </div>

        {/* Active Orders Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Pending / Active</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.pending_orders : '---'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Needs packaging or dispatch</p>
        </div>

        {/* Total Catalog Items */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.total_products : '---'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Live on storefront</p>
        </div>

        {/* Stock Alerts */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Low Stock Warnings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {stats ? stats.out_of_stock_count : '---'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">&lt; 5 units remaining</p>
        </div>
      </div>

      {/* Recent Orders Live Stream */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Incoming Order Stream</span>
            </h2>
            <p className="text-xs text-slate-400">Action items requiring immediate merchant fulfillment</p>
          </div>
          <Link href="/orders" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No incoming orders at the moment.
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="glass-card rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">#{ord.id}</span>
                    <span className="text-[11px] text-slate-400">• {ord.customer_name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ord.order_status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : ord.order_status === 'accepted'
                          ? 'bg-teal-500/20 text-teal-300'
                          : ord.order_status === 'out_for_delivery'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {ord.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{ord.delivery_address}</p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>
                      Items: {ord.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </span>
                    <span className="font-bold text-emerald-400">₹{ord.total_amount.toFixed(2)}</span>
                    <span className="text-slate-500 font-semibold">{ord.payment_method}</span>
                  </div>
                </div>

                {/* Status Quick Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {ord.order_status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(ord.id, 'accepted')}
                      className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-colors"
                    >
                      Accept & Pack
                    </button>
                  )}
                  {ord.order_status === 'accepted' && (
                    <button
                      onClick={() => handleStatusChange(ord.id, 'out_for_delivery')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch</span>
                    </button>
                  )}
                  {ord.order_status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleStatusChange(ord.id, 'delivered')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  )}
                  {ord.order_status === 'delivered' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Fulfilled</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
