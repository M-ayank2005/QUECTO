'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MapPin,
  AlertCircle,
  XCircle,
  HeartHandshake,
} from 'lucide-react';
import { fetchAdminOrders, updateOrderStatus, AdminOrder } from '../../lib/api';

const STATUS_TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted / Packing' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAdminOrders(activeTab);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Orders Pipeline</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track customer deliveries, update order statuses, and fulfill neighborhood requests.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or phone..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'glass-pill-active text-white'
                : 'glass-pill text-slate-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading orders pipeline...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-400 space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="font-bold text-white">No orders in this status category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 relative"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-white">#{ord.id}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ord.order_status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : ord.order_status === 'accepted'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : ord.order_status === 'out_for_delivery'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {ord.order_status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Total:</span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{ord.total_amount.toFixed(2)}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-semibold ml-1">
                    {ord.payment_method}
                  </span>
                </div>
              </div>

              {/* Middle Row: Customer Info & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Details */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{ord.customer_name}</span>
                    <a
                      href={`tel:${ord.customer_phone}`}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{ord.customer_phone}</span>
                    </a>
                  </div>

                  <p className="text-slate-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ord.delivery_address}</span>
                  </p>

                  {ord.notes && (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                      <span className="font-bold">Note: </span>
                      {ord.notes}
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Order Items
                  </span>
                  <div className="space-y-1.5">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-200">
                          {item.quantity} × {item.product_name}
                        </span>
                        <span className="font-bold text-slate-300">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                {ord.order_status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(ord.id, 'accepted')}
                    className="px-4 py-2 rounded-xl glass-button-primary text-white text-xs font-bold"
                  >
                    Accept Order & Pack
                  </button>
                )}

                {ord.order_status === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange(ord.id, 'out_for_delivery')}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Out for Delivery</span>
                  </button>
                )}

                {ord.order_status === 'out_for_delivery' && (
                  <button
                    onClick={() => handleStatusChange(ord.id, 'delivered')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Delivered</span>
                  </button>
                )}

                {ord.order_status !== 'delivered' && ord.order_status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(ord.id, 'cancelled')}
                    className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
