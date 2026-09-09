'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { fetchAdminProducts, addAdminProduct, updateAdminProduct, AdminProduct } from '../../lib/api';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    category: 'Staples',
    price: '',
    unit: '1 kg',
    stock: '20',
    image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop',
  });

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchAdminProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = async (prodId: string, delta: number) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    await updateAdminProduct(prodId, { stock: newStock });
    loadProducts();
  };

  const handleToggleStock = async (prodId: string, currentStatus: boolean) => {
    await updateAdminProduct(prodId, { in_stock: !currentStatus });
    loadProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    await addAdminProduct({
      name: newProd.name,
      description: newProd.description,
      category: newProd.category,
      price: parseFloat(newProd.price),
      unit: newProd.unit,
      stock: parseInt(newProd.stock) || 0,
      image_url: newProd.image_url,
    });

    setIsModalOpen(false);
    setNewProd({
      name: '',
      description: '',
      category: 'Staples',
      price: '',
      unit: '1 kg',
      stock: '20',
      image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop',
    });
    loadProducts();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Stock & Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your store's live item catalog, availability, and inventory counts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
        />
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Stock Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">{prod.name}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
                        {prod.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-400">
                      ₹{prod.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-slate-300">{prod.unit}</td>

                    {/* Stock Counter */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStockChange(prod.id, -1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className={`w-8 text-center font-bold ${prod.stock <= 5 ? 'text-amber-400' : 'text-white'}`}>
                          {prod.stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(prod.id, 1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* In Stock Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(prod.id, prod.in_stock)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          prod.in_stock
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {prod.in_stock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleStockChange(prod.id, 10)}
                        className="text-[11px] text-emerald-400 hover:underline font-semibold"
                      >
                        +10 Quick Restock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 max-w-lg w-full space-y-4 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-400" />
                <span>Add Product to Storefront</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Sona Masoori Rice"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <input
                  type="text"
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="e.g. Premium aged grain daily cooking rice"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-slate-900"
                  >
                    <option value="Staples">Staples</option>
                    <option value="Oils">Oils</option>
                    <option value="Rice & Grains">Rice & Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Snacks">Snacks</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Price (INR)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="e.g. 120"
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Unit / Weight</label>
                  <input
                    type="text"
                    required
                    value={newProd.unit}
                    onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                    placeholder="e.g. 1 kg, 500 ml"
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Image URL</label>
                <input
                  type="url"
                  value={newProd.image_url}
                  onChange={(e) => setNewProd({ ...newProd, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl glass-button-primary text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
