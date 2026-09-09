'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, activeShopId, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSeniorAssisted, setIsSeniorAssisted] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-400">
          Add fresh goods or daily essentials from your nearby local store before proceeding.
        </p>
        <Link
          href="/shops"
          className="inline-block px-5 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold"
        >
          Explore Nearby Stores
        </Link>
      </div>
    );
  }

  const deliveryFee = totalAmount >= 199 ? 0 : 15;
  const grandTotal = totalAmount + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your name, contact number, and delivery address.');
      return;
    }

    setSubmitting(true);
    setError('');

    let combinedNotes = notes.trim();
    if (isSeniorAssisted) {
      combinedNotes = '[Elderly/Assisted Delivery Requested] ' + combinedNotes;
    }

    try {
      const order = await createOrder({
        shop_id: activeShopId || 'shop-1',
        customer_name: name,
        customer_phone: phone,
        delivery_address: address,
        payment_method: paymentMethod,
        notes: combinedNotes,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
      });

      clearCart();
      // Store token in session for private tracking
      if (order.tracking_token) {
        sessionStorage.setItem(`track_${order.id}`, order.tracking_token);
      }
      router.push(`/order/${order.id}?token=${order.tracking_token || ''}`);
    } catch (err) {
      setError('Failed to submit order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link
        href="/shops"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Order Checkout</h1>
        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Local Shopkeeper Direct Order</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Details (2 cols) */}
        <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Delivery Details Glass Panel */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Delivery Details</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Delivery Address & Flat/House No.</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 301, Tower B, Gomti Nagar, Lucknow"
                  className="w-full p-3 rounded-xl glass-input text-xs"
                />
              </div>

              {/* Elderly / Assisted Delivery Checkbox */}
              <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="senior"
                  checked={isSeniorAssisted}
                  onChange={(e) => setIsSeniorAssisted(e.target.checked)}
                  className="mt-0.5 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-400"
                />
                <label htmlFor="senior" className="text-xs text-slate-200 cursor-pointer">
                  <span className="font-bold text-emerald-300 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Senior Citizen / Special Assisted Delivery
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Notify the merchant to ring bell gently, assist with bags, or call prior to arrival.
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Special Instructions (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave at security gate, ring bell twice..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Glass Panel */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'COD'
                    ? 'glass-pill-active border-emerald-500'
                    : 'glass-card border-white/10 hover:border-white/20'
                }`}
              >
                <Banknote className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-400">Pay cash upon inspecting order</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'UPI'
                    ? 'glass-pill-active border-emerald-500'
                    : 'glass-card border-white/10 hover:border-white/20'
                }`}
              >
                <QrCode className="w-6 h-6 text-teal-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Direct UPI QR</h4>
                  <p className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl glass-button-primary text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 active:scale-[0.99] transition-all"
          >
            {submitting ? (
              <span>Placing Order with Store...</span>
            ) : (
              <span>Confirm & Place Order (₹{grandTotal.toFixed(2)})</span>
            )}
          </button>
        </form>

        {/* Order Summary Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
              <span>Basket Summary</span>
              <span className="text-xs text-emerald-400 font-normal">
                {items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-200 line-clamp-1">{item.product.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {item.quantity} × ₹{item.product.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-bold text-white">
                    ₹{(item.quantity * item.product.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Local Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-emerald-400 text-lg">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Quecto Fair Retail Guarantee</span>
            </div>
            <p>100% of your payment goes to the neighborhood store without middleman commissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
