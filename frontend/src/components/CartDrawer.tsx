'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalAmount, clearCart } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 199;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - totalAmount);
  const deliveryProgress = Math.min(100, (totalAmount / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Incentive Banner */}
          <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-500/20">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              {amountNeeded > 0 ? (
                <span className="text-slate-300">
                  Add <span className="text-emerald-400">₹{amountNeeded.toFixed(0)}</span> more for <span className="text-emerald-300">FREE delivery</span>!
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked FREE local delivery!
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-normal">₹199 Min</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">Your basket is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover fresh goods, groceries, dairy and produce from your nearby neighborhood shops!
                </p>
                <Link
                  href="/shops"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                >
                  Browse Nearby Shops
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="glass-card rounded-xl p-3 flex items-center gap-3.5 border border-white/5"
                >
                  {/* Item Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/10 relative">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.product.unit}</p>
                    <p className="text-xs font-extrabold text-emerald-400 mt-0.5">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-1.5 bg-white/[0.05] p-1 rounded-lg border border-white/10 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 glass-panel space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Delivery</span>
                  <span className={amountNeeded === 0 ? 'text-emerald-400 font-semibold' : ''}>
                    {amountNeeded === 0 ? 'FREE' : '₹15.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-white/10">
                  <span>To Pay</span>
                  <span className="text-emerald-400 text-base">
                    ₹{(totalAmount + (amountNeeded === 0 ? 0 : 15)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl glass-button-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct payment to local merchant • Cash on Delivery / UPI</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
