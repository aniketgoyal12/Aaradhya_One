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
      title="Assemble Bundled Shubarmbh Package"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/80 mb-1.5">
              Package Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Satyanarayan Mahapooja Grand Kit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0508] border border-gold-500/20 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 text-sm transition-colors shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/80 mb-1.5">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://cdn.shubarmbh.com/kits/..."
              value={imageURI}
              onChange={(e) => setImageURI(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0508] border border-gold-500/20 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 text-sm transition-colors shadow-inner"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400/80 mb-1.5">
            Package Summary & Ritual Context
          </label>
          <textarea
            rows={2}
            placeholder="Sacred rituals, auspicious occasions, Vedic items included..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0508] border border-gold-500/20 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 text-sm transition-colors shadow-inner"
          />
        </div>

        {/* Dynamic Bundling Section */}
        <div className="border border-gold-500/20 rounded-2xl p-4 bg-[#12070a]/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Included Items in Bundle ({selectedItems.length})
            </h4>

            {/* Price Masking Note */}
            <div className="flex items-center gap-1 text-[11px] text-gold-300 bg-maroon-950/80 px-2 py-0.5 rounded-lg border border-gold-500/30">
              <Info className="w-3 h-3 flex-shrink-0 text-gold-400" />
              <span>Devotee cards show bundled kit price; item costs are masked.</span>
            </div>
          </div>

          {/* Item Selector Dropdown */}
          <div className="flex gap-2">
            <select
              className="flex-1 px-3 py-2 rounded-xl bg-[#1c0c11] border border-gold-500/25 text-stone-200 text-xs focus:outline-none focus:border-gold-400"
              onChange={(e) => {
                if (e.target.value) {
                  addItem(Number(e.target.value));
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                + Select a Shubarmbh inventory item to bundle...
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
            <p className="text-xs text-stone-500 py-3 text-center italic">
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
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#1a0b10] border border-gold-500/15 text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-stone-200 truncate">{product?.name}</p>
                      <p className="text-[11px] text-stone-500">
                        ₹{parseFloat(product?.price || 0).toFixed(2)} unit cost
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-stone-400">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                          className="w-14 px-2 py-1 rounded bg-[#0d0508] border border-gold-500/25 text-stone-100 text-center text-xs"
                        />
                      </div>
                      <span className="font-mono font-semibold text-gold-300 w-20 text-right">
                        ₹{itemTotal.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product_id)}
                        className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
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
          <div className="pt-3 border-t border-gold-500/15 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">
              Calculated Package Base Price:
            </span>
            <span className="text-lg font-bold font-mono text-gold-300">
              ₹{calculatedBasePrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold-500/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200 bg-[#1e0d13] hover:bg-[#2a121b] rounded-xl border border-gold-500/15 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedItems.length === 0}
            className="px-5 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-gold-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Publish Bundled Package</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
