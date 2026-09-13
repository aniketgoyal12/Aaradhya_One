import React, { useState } from 'react';
import { Layers, Plus, Eye, Sparkles, Package as PackageIcon, Check } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Pre-Assembled Devotional Bundles</h2>
          <p className="text-xs text-slate-400">
            Kits created for festivals with dynamic item masking and deduction rules.
          </p>
        </div>

        <button
          onClick={onOpenPackageBuilder}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Assemble New Package</span>
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Layers className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No pooja packages available yet.</p>
            <p className="text-xs text-slate-600 mt-1">
              Assemble your first kit combining multiple inventory products with masked pricing.
            </p>
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image or Devotional Placeholder */}
                <div className="h-40 bg-slate-950/80 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
                  {pkg.image_URI ? (
                    <img
                      src={pkg.image_URI}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-700">
                      <Sparkles className="w-8 h-8 text-amber-500/40" />
                      <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
                        Aaradhya Bundled Kit
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono font-bold text-amber-400 backdrop-blur-md">
                    ₹{parseFloat(pkg.base_price).toFixed(2)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {pkg.description || 'Pre-assembled ceremonial kit with all necessary Vedic samagri.'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Item Masking Active
                </span>

                <button
                  onClick={() => handleInspectPackage(pkg.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect Items</span>
                </button>
              </div>
            </div>
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
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Bundled Base Price</p>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  ₹{parseFloat(selectedPackage.base_price).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
                  Masked Price Rule
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Customers only see bundled base price.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Relational Bundled Items ({selectedPackage.items?.length || 0})
              </h4>

              <div className="border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
                {selectedPackage.items?.map((item) => (
                  <div
                    key={item.package_item_id}
                    className="p-3 bg-slate-900/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-amber-400">
                        <PackageIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{item.product_name}</p>
                        <p className="text-[11px] text-slate-400">
                          Included Qty: <span className="text-slate-200 font-bold">{item.quantity}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-slate-300">
                        ₹{parseFloat(item.item_price).toFixed(2)} each
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Deduction Value: ₹{(parseFloat(item.item_price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Dynamic Removal Invariant:</strong> If a devotee selects this package and removes an item they already possess at home, the backend will dynamically deduct that item's unit price from the order total.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
