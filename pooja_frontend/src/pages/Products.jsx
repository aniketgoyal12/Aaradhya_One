import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package, AlertCircle } from 'lucide-react';

export default function Products({ products = [], onOpenCreate, onOpenEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = async (product) => {
    if (window.confirm(`Are you sure you want to remove "${product.name}" from inventory?`)) {
      setDeletingId(product.id);
      try {
        await onDelete(product.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search devotional items by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCreate}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                    {searchTerm ? 'No matching products found.' : 'No products in inventory yet.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLowStock = (p.stock_quantity ?? 0) <= 5;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.image_URI ? (
                              <img
                                src={p.image_URI}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-md">
                            <p className="font-semibold text-slate-200 truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {p.description || 'No description provided'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        ₹{parseFloat(p.price).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            isLowStock
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isLowStock && <AlertCircle className="w-3 h-3" />}
                          {p.stock_quantity} in stock
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => onOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          disabled={deletingId === p.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
