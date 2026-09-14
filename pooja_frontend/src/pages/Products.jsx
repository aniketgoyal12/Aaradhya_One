import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gold-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Shubarmbh devotional samagri by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#14080c]/80 border border-gold-500/20 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-all backdrop-blur-md shadow-inner"
          />
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenCreate}
          className="px-4 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 rounded-2xl transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </motion.button>
      </div>

      {/* Products Table */}
      <div className="bg-[#14080c]/90 border border-gold-500/20 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-500/15 bg-[#1a0b10]/90 text-[11px] font-bold uppercase tracking-wider text-gold-400/80">
                <th className="py-4 px-5">Samagri Item</th>
                <th className="py-4 px-5">Price</th>
                <th className="py-4 px-5">Stock Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500 italic">
                    {searchTerm ? 'No matching products found.' : 'No products in inventory yet.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const isLowStock = (p.stock_quantity ?? 0) <= 5;
                  return (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                      className="hover:bg-maroon-950/30 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-[#1f0d13] border border-gold-500/25 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner group-hover:border-gold-400/50 transition-colors">
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
                              <Package className="w-4 h-4 text-gold-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-md">
                            <p className="font-bold text-stone-200 truncate group-hover:text-gold-300 transition-colors">{p.name}</p>
                            <p className="text-[11px] text-stone-400 truncate mt-0.5">
                              {p.description || 'Devotional ritual samagri item'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-mono font-bold text-gold-300">
                        ₹{parseFloat(p.price).toFixed(2)}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            isLowStock
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                          {p.stock_quantity} in stock
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right space-x-1.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onOpenEdit(p)}
                          className="p-2 rounded-xl text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(p)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

