import React, { useState } from 'react';
import { Layers, Plus, Eye, Sparkles, Package as PackageIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import Modal from '../components/ui/Modal';

export default function Packages({ packages = [], onOpenPackageBuilder }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleInspectPackage = async (pkgId) => {
    setLoadingDetail(true);
    try {
      const res = await api.getPackageById(pkgId);
      if (res.success && res.data) {
        setSelectedPackage(res.data);
      }
    } catch (err) {
      console.error('Failed to load package details:', err);
    } finally {
      setLoadingDetail(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Pre-Assembled Ritual Bundles</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {packages.length} Kits Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Festive packages with dynamic item price masking and server-side deduction rules.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPackageBuilder}
          className="px-4 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 rounded-2xl transition-all shadow-lg shadow-gold-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Assemble New Package</span>
        </motion.button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#14080c]/60 border border-gold-500/20 rounded-3xl backdrop-blur-md">
            <Layers className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-sm text-stone-300 font-bold">No pooja packages available yet.</p>
            <p className="text-xs text-stone-500 mt-1">
              Assemble your first Shubarmbh kit combining multiple inventory products with dynamic deduction rules.
            </p>
          </div>
        ) : (
          packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-[#14080c]/90 border border-gold-500/20 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-gold-400/50 transition-all shadow-xl shadow-black/80 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image or Devotional Glyph */}
                <div className="h-44 bg-[#0d0508] relative flex items-center justify-center overflow-hidden border-b border-gold-500/15">
                  {pkg.image_URI ? (
                    <img
                      src={pkg.image_URI}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-700">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-6 h-6 text-gold-400" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-gold-400/70 font-bold">
                        Shubarmbh Ritual Kit
                      </span>
                    </div>
                  )}

                  {/* Masked Price Pill */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#0a0406]/90 border border-gold-500/30 text-xs font-mono font-bold text-gold-300 backdrop-blur-md shadow-lg">
                    ₹{parseFloat(pkg.base_price).toFixed(2)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-stone-100 group-hover:text-gold-300 transition-colors line-clamp-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {pkg.description || 'Pre-assembled ceremonial kit with all necessary Vedic samagri.'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-[#0d0508]/80 border-t border-gold-500/15 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Item Masking Active
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInspectPackage(pkg.id)}
                  className="px-3 py-1.5 text-xs font-bold text-stone-300 hover:text-gold-300 bg-[#1e0d13] hover:bg-maroon-900/50 rounded-xl transition-colors flex items-center gap-1.5 border border-gold-500/20"
                >
                  <Eye className="w-3.5 h-3.5 text-gold-400" />
                  <span>Inspect</span>
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Package Detail Modal */}
      {selectedPackage && (
        <Modal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          title={`Package Specification: ${selectedPackage.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-[#0d0508] border border-gold-500/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gold-400/80 uppercase tracking-widest font-bold">Bundled Base Price</p>
                <p className="text-2xl font-extrabold font-mono text-gold-300 mt-0.5">
                  ₹{parseFloat(selectedPackage.base_price).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-maroon-950/80 text-gold-300 text-[11px] font-bold border border-gold-500/30">
                  Masked Price Rule
                </span>
                <p className="text-[10px] text-stone-400 mt-1">
                  Customers only see bundled base price.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400/90 mb-3">
                Relational Bundled Items ({selectedPackage.items?.length || 0})
              </h4>

              <div className="border border-gold-500/20 rounded-2xl divide-y divide-gold-500/10 overflow-hidden bg-[#0d0508]/60">
                {selectedPackage.items?.map((item) => (
                  <div
                    key={item.package_item_id}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-maroon-950/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1e0d13] flex items-center justify-center text-gold-400 border border-gold-500/25">
                        <PackageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-200">{item.product_name}</p>
                        <p className="text-[11px] text-stone-400">
                          Included Qty: <span className="text-gold-400 font-bold">{item.quantity}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-semibold text-stone-300">
                        ₹{parseFloat(item.item_price).toFixed(2)} each
                      </span>
                      <p className="text-[10px] text-gold-400/80 font-mono">
                        Deduction Value: ₹{(parseFloat(item.item_price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1f0d14]/80 border border-gold-500/20 text-xs text-gold-200/90 leading-relaxed">
              💡 <strong>Dynamic Removal Invariant:</strong> If a devotee selects this package and removes an item they already possess at home, the backend dynamically deducts that item's unit price from the order total.
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

