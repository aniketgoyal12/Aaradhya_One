import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import { Plus, Trash2, Info, Loader2, Sparkles } from 'lucide-react';

export default function PackageBuilder({ isOpen, onClose, onSave, availableProducts = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageURI, setImageURI] = useState('');
  const [selectedItems, setSelectedItems] = useState([]); // [{ product_id, quantity }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live calculation of package base price based on selected items
  const calculatedBasePrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const prod = availableProducts.find((p) => p.id === Number(item.product_id));
      const price = prod ? parseFloat(prod.price) : 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [selectedItems, availableProducts]);

  const addItem = (productId) => {
    if (selectedItems.some((item) => item.product_id === productId)) return;
    setSelectedItems([...selectedItems, { product_id: productId, quantity: 1 }]);
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    const quantity = Math.max(1, parseInt(qty, 10) || 1);
    setSelectedItems(
      selectedItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Package name is required.');
      return;
    }
    if (selectedItems.length === 0) {
      setError('At least one item must be included in the bundle.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        name,
        description,
        image_URI: imageURI || null,
        items: selectedItems.map((i) => ({
          product_id: Number(i.product_id),
          quantity: i.quantity,
        })),
      });
      // Reset
      setName('');
      setDescription('');
      setImageURI('');
      setSelectedItems([]);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assemble package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assemble Bundled Pooja Package"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Package Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Satyanarayan Mahapooja Grand Kit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://cdn.aaradhya.com/kits/..."
              value={imageURI}
              onChange={(e) => setImageURI(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Package Summary & Ritual Context
          </label>
          <textarea
            rows={2}
            placeholder="Sacred rituals, auspicious occasions, Vedic items included..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
          />
        </div>

        {/* Dynamic Bundling Section */}
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Included Items in Bundle ({selectedItems.length})
            </h4>

            {/* Price Masking Note */}
            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Info className="w-3 h-3 flex-shrink-0" />
              <span>Devotee cards show bundled price; item costs are masked.</span>
            </div>
          </div>

          {/* Item Selector Dropdown */}
          <div className="flex gap-2">
            <select
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              onChange={(e) => {
                if (e.target.value) {
                  addItem(Number(e.target.value));
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                + Select an inventory item to bundle...
              </option>
              {availableProducts
                .filter((p) => !selectedItems.some((i) => i.product_id === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{parseFloat(p.price).toFixed(2)} (Stock: {p.stock_quantity})
                  </option>
                ))}
            </select>
          </div>

          {/* List of bundled items */}
          {selectedItems.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center italic">
              No items added yet. Select products from the dropdown above to calculate the package price.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedItems.map((item) => {
                const product = availableProducts.find((p) => p.id === Number(item.product_id));
                const itemTotal = product ? parseFloat(product.price) * item.quantity : 0;
                return (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-slate-200 truncate">{product?.name}</p>
                      <p className="text-[11px] text-slate-500">
                        ₹{parseFloat(product?.price || 0).toFixed(2)} unit cost
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-100 text-center text-xs"
                        />
                      </div>
                      <span className="font-mono font-semibold text-amber-400 w-20 text-right">
                        ₹{itemTotal.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product_id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total Calculated Base Price Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Calculated Package Base Price:
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              ₹{calculatedBasePrice.toFixed(2)}
            </span>
          </div>
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
            disabled={loading || selectedItems.length === 0}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Publish Bundled Package</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
