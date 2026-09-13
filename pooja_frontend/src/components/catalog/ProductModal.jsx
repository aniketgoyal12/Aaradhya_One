import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Loader2 } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: 0,
    image_URI: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        stock_quantity: editingProduct.stock_quantity ?? 0,
        image_URI: editingProduct.image_URI || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: 10,
        image_URI: '',
      });
    }
    setError(null);
  }, [editingProduct, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price === '') {
      setError('Product name and price are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Edit Devotional Product' : 'Add New Product to Inventory'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Product Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Pure Gangajal (250ml) or Clay Ganesha Idol"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Ritual purpose, purity guarantees, material details..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="199.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Image URL (Optional CDN link)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={formData.image_URI}
            onChange={(e) => setFormData({ ...formData, image_URI: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {editingProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
