'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Truck,
  PackageCheck,
  AlertCircle,
  Sparkles,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchCustomerOrders, Order } from '../../lib/api';

export default function CustomerOrdersPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchCustomerOrders(user.email, user.phone).then((res) => {
        setOrders(res);
        setLoading(false);
      });
    } else if (!isLoading) {
      // Fallback guest order fetch
      fetchCustomerOrders('customer@gmail.com').then((res) => {
        setOrders(res);
        setLoading(false);
      });
    }
  }, [user, isLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Accepted by Merchant</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Merchant Confirmation</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Customer Order Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Your Orders & History</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {user
              ? `Showing orders placed by ${user.name} (${user.email})`
              : 'Sign in to sync orders automatically across all your devices.'}
          </p>
        </div>

        {!user && (
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl glass-button-primary text-slate-950 font-bold text-xs flex items-center gap-2"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Clock className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Retrieving your order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-white/10 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400">
            Order fresh produce, milk, and daily essentials from neighborhood kirana stores with direct delivery to your apartment.
          </p>
          <Link
            href="/shops"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-button-primary text-slate-950 font-bold text-xs"
          >
            <span>Browse Local Shops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-emerald-500/30 transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{ord.id}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">{ord.delivery_address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(ord.order_status)}
                  <span className="text-base font-extrabold text-white">₹{ord.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {ord.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-200 line-clamp-1">{it.product_name}</span>
                    <span className="text-slate-400 shrink-0 font-medium ml-2">
                      {it.quantity} × ₹{it.price.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Action */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Payment: <strong className="text-slate-200 uppercase">{ord.payment_method}</strong> ({ord.payment_status})
                </span>

                <Link
                  href={`/order/${ord.id}`}
                  className="px-4 py-2 rounded-xl glass-button-secondary text-emerald-400 hover:text-white font-bold flex items-center gap-1.5"
                >
                  <span>Live 4-Step Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
