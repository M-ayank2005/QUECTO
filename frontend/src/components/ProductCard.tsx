'use client';

import React from 'react';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../lib/api';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-900">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/40" />

        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-semibold text-slate-300 border border-white/10">
          {product.category}
        </div>

        {product.in_stock ? (
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
            In Stock
          </div>
        ) : (
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold text-rose-300 backdrop-blur-md">
            Out of Stock
          </div>
        )}
      </div>

      {/* Details & Cart Controller */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {product.name}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{product.description}</p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block -mb-0.5">{product.unit}</span>
            <span className="text-base font-black text-emerald-400">₹{product.price.toFixed(2)}</span>
          </div>

          {/* Quantity Controls */}
          {currentQty === 0 ? (
            <button
              onClick={() => addItem(product, 1)}
              disabled={!product.in_stock}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                product.in_stock
                  ? 'glass-button-primary text-white active:scale-95 shadow-md shadow-emerald-500/25'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 p-1 rounded-xl">
              <button
                onClick={() => updateQuantity(product.id, currentQty - 1)}
                className="w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/50 flex items-center justify-center transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center text-xs font-black text-white">{currentQty}</span>
              <button
                onClick={() => updateQuantity(product.id, currentQty + 1)}
                className="w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/50 flex items-center justify-center transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
