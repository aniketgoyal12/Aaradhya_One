import React from 'react';
import { Package, Layers, Radio, ShoppingBag, Plus, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
import StatCard from '../components/ui/StatCard';

export default function Dashboard({ products = [], packages = [], orders = [], onNavigate, onOpenProductModal, onOpenPackageBuilder }) {
  const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);
  const totalRevenue = orders.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aaradhya Platform Control Center</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Welcome to the Devotional Governance Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Configure ritual items, assemble bundled festival packages with masked pricing rules, govern customer orders with custom deductions, and oversee zonal Pujari dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProductModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Item</span>
          </button>
          <button
            onClick={onOpenPackageBuilder}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Assemble Package</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Catalog Items"
          value={products.length}
          change={`${totalInventoryUnits} units stock`}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Bundled Packages"
          value={packages.length}
          change="Masked Pricing Active"
          icon={Layers}
          color="emerald"
        />
        <StatCard
          title="Platform Orders"
          value={orders.length}
          change={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })} Revenue`}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Zonal Dispatch Engine"
          value="Phase 3 Ready"
          change="Atomic Locks Scoped"
          icon={Radio}
          color="purple"
        />
      </div>

      {/* Phase Roadmap Status & Quick Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Catalog Overview */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Live Catalog Packages</h3>
              <p className="text-xs text-slate-400">Bundled festival kits available for devotee order</p>
            </div>
            <button
              onClick={() => onNavigate('packages')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({packages.length})</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-800/60">
            {packages.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                No packages created yet. Use the "Assemble Package" button to bundle items.
              </p>
            ) : (
              packages.slice(0, 4).map((pkg) => (
                <div key={pkg.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{pkg.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">
                      {pkg.description || 'Custom bundled ritual kit'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-amber-400">
                      ₹{parseFloat(pkg.base_price).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                      Masked Base
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Platform Delivery Stages */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-slate-800">
              System Delivery Roadmap
            </h3>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Phase 1: Catalog & RBAC Auth</p>
                  <p className="text-[11px] text-slate-400">PostgreSQL CRUD, JWT verification & package bundling.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-300">Phase 2: Customization & Orders Engine</p>
                  <p className="text-[11px] text-slate-400">Dynamic masked pricing, item deductions & atomic stock.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-300">Phase 3: Atomic Zonal Broadcast</p>
                  <p className="text-[11px] text-slate-400">Pujari broadcast engine & Redis escrow release.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-400">Phase 4: Live Support Transcripts</p>
                  <p className="text-[11px] text-slate-500">Ticket assignment & full transcript inspection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Aaradhya One Architecture Blueprint v1.2
          </div>
        </div>
      </div>
    </div>
  );
}
