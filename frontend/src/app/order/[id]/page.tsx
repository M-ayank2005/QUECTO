'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  Store,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { fetchOrder, Order } from '../../../lib/api';

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const token = searchParams.get('token') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(orderId, token).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderId, token]);

  const steps = [
    { key: 'pending', label: 'Order Received', icon: Clock },
    { key: 'accepted', label: 'Packed by Store', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.order_status) : 1;

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Fetching order live status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 text-center space-y-3 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
          Order Successfully Dispatched to Merchant
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Order #{orderId}
        </h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          The local merchant has received your order and is preparing your basket for immediate doorstep fulfillment.
        </p>
      </div>

      {/* 3D Glass Stepper */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h2 className="text-sm font-bold text-white tracking-wider uppercase">Live Fulfillment Status</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className={`p-4 rounded-2xl border transition-all text-center space-y-2 flex flex-col items-center justify-center ${
                  isCurrent
                    ? 'glass-pill-active border-emerald-500 scale-105 shadow-xl shadow-emerald-500/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.02] border-white/5 text-slate-500'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold block">{step.label}</span>
                {isCurrent && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Info & Delivery Address */}
      {order && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Delivering To</span>
            </h3>
            <p className="text-xs font-bold text-slate-200">{order.customer_name}</p>
            <p className="text-xs text-slate-400">{order.delivery_address}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{order.customer_phone}</span>
            </p>
            {order.notes && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-emerald-300">
                <span className="font-bold">Instructions: </span> {order.notes}
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Payment & Merchant</span>
            </h3>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-white">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Amount:</span>
                <span className="font-bold text-emerald-400 text-sm">₹{order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="text-emerald-300 uppercase font-semibold text-[11px]">
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home CTA */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-button-secondary text-xs font-bold text-slate-200 hover:text-white"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
