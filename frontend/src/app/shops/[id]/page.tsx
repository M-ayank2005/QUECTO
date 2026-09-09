'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  MapPin,
  Phone,
  Star,
  Clock,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { fetchShop, fetchShopProducts, Shop, Product } from '../../../lib/api';
import ProductCard from '../../../components/ProductCard';
import { useCart } from '../../../context/CartContext';

export default function ShopStorefrontPage() {
  const params = useParams();
  const shopId = params.id as string;
  const { totalItems, totalAmount, setIsCartOpen } = useCart();

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchShop(shopId), fetchShopProducts(shopId)]).then(([s, prods]) => {
      setShop(s);
      setProducts(prods);
      setLoading(false);
    });
  }, [shopId]);

  if (loading) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading verified store catalog...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Shop not found</h2>
        <Link href="/shops" className="text-xs text-emerald-400 font-bold hover:underline">
          ← Back to all shops
        </Link>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8 py-4">
      {/* Back Link */}
      <Link
        href="/shops"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Nearby Stores</span>
      </Link>

      {/* Shop Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
              <img
                src={shop.image_url}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  {shop.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{shop.rating.toFixed(1)} Rating</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium">
                  Verified Local Merchant
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">{shop.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{shop.address}, {shop.city}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{shop.phone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Delivery terms pill */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 shrink-0 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Delivery Charge:</span>
              <span className="font-bold text-emerald-400">
                {shop.delivery_fee === 0 ? 'FREE' : `₹${shop.delivery_fee.toFixed(0)}`}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Minimum Order:</span>
              <span className="font-bold text-white">₹{shop.min_order.toFixed(0)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Est. Fulfillment:</span>
              <span className="font-bold text-slate-200">15-25 Mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'glass-pill-active text-white'
                : 'glass-pill text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            Available Inventory ({filteredProducts.length})
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-xs text-slate-400">
            No products available in this category currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Sticky Bar (if items in cart) */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full glass-panel rounded-2xl p-4 border border-emerald-500/40 shadow-2xl shadow-emerald-500/25 flex items-center justify-between hover:scale-[1.02] transition-transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-300 block">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in basket
                </span>
                <span className="text-sm font-extrabold text-white">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md">
              <span>View Cart & Checkout</span>
              <span>→</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
