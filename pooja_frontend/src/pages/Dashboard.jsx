import React from 'react';
import { 
  Package, 
  Layers, 
  Radio, 
  ShoppingBag, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  MessageSquareText, 
  Landmark,
  ShieldCheck,
  TrendingUp,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/ui/StatCard';
import brandLogo from '../logo/Shubarmbh Pooja Essentials Logo(2).png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard({ 
  products = [], 
  packages = [], 
  orders = [], 
  bookings = [], 
  tickets = [], 
  settlements = null,
  onNavigate, 
  onOpenProductModal, 
  onOpenPackageBuilder 
}) {
  const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);
  const totalGMV = settlements?.stats?.total_gmv || orders.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0);
  const escrowHeld = settlements?.stats?.total_escrow_held || 0;

  const brandPillars = [
    { label: 'Pooja Items', desc: 'Sacred samagri & pure ingredients' },
    { label: 'Ritual Essentials', desc: 'Kalash, diyas & brassware' },
    { label: 'Spiritual Gifts', desc: 'Auspicious keepsakes & mementos' },
    { label: 'Traditional Products', desc: 'Vedic blends & puja dravyas' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8"
    >
      {/* 1. Hero Welcome Banner with Shubarmbh Brand Logo & Ambient Aura */}
      <motion.div 
        variants={itemVariants}
        className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1f0b12] via-[#16070b] to-[#0f0407] border border-gold-500/30 overflow-hidden backdrop-blur-2xl shadow-2xl shadow-black/80"
      >
        {/* Decorative ambient Diya glow pulse */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-gold-500/15 to-maroon-800/20 rounded-full blur-3xl pointer-events-none animate-diya" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-maroon-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5 max-w-2xl">
            {/* High-res Shubarmbh Logo Badge */}
            <div className="relative flex-shrink-0 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FAF5EE] p-1.5 border-2 border-gold-400/60 flex items-center justify-center shadow-xl shadow-black/60 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={brandLogo} 
                  alt="Shubarmbh" 
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gold-500/25 blur-sm -z-10 group-hover:bg-gold-500/40 transition-colors" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-950/80 border border-gold-500/30 text-gold-300 text-xs font-bold tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Shubarmbh Platform Governance</span>
              </div>
              <h2 className="brand-regal text-2xl sm:text-3xl font-bold text-gold-gradient tracking-wide">
                Pooja Essentials For a Divine Life
              </h2>
              <p className="text-xs sm:text-sm text-stone-300/80 mt-1.5 leading-relaxed">
                Centralized devotional orchestration: inventory cataloging, custom kit bundling with dynamic samagri deduction, zonal Pujari dispatch, and verified escrow payouts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenProductModal}
              className="px-4 py-2.5 text-xs font-semibold text-gold-200 bg-[#1e0d13] hover:bg-maroon-900/60 border border-gold-500/30 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-gold-400" />
              <span>New Item</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenPackageBuilder}
              className="px-4 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-gold-500/20 flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Assemble Kit</span>
            </motion.button>
          </div>
        </div>

        {/* Brand Pillars Highlight Row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-5 mt-5 border-t border-gold-500/15">
          {brandPillars.map((pillar, pIdx) => (
            <div 
              key={pIdx} 
              className="px-3 py-2 rounded-xl bg-[#15070a]/60 border border-gold-500/15 hover:border-gold-500/35 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-gold-300 font-bold text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>{pillar.label}</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5 truncate">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2. Primary KPI Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Catalog Items"
          value={products.length}
          change={`${totalInventoryUnits} units stock`}
          icon={Package}
          color="gold"
          delay={0}
        />
        <StatCard
          title="Bundled Packages"
          value={packages.length}
          change="Dynamic Deduction Active"
          icon={Layers}
          color="maroon"
          delay={0.06}
        />
        <StatCard
          title="Platform Orders & GMV"
          value={`₹${parseFloat(totalGMV).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change={`${orders.length} orders placed`}
          icon={ShoppingBag}
          color="emerald"
          delay={0.12}
        />
        <StatCard
          title="Escrow & Payouts"
          value={`₹${parseFloat(escrowHeld).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change={`${bookings.length} zonal bookings`}
          icon={Landmark}
          color="amber"
          delay={0.18}
        />
      </motion.div>

      {/* 3. Quick Navigation Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'products', label: 'Inventory', count: `${products.length} Items`, icon: Package },
          { id: 'packages', label: 'Packages', count: `${packages.length} Kits`, icon: Layers },
          { id: 'orders', label: 'Orders', count: `${orders.length} Placed`, icon: ShoppingBag },
          { id: 'pujari-dispatch', label: 'Zonal Dispatch', count: `${bookings.length} Bookings`, icon: Radio },
          { id: 'support-tickets', label: 'Support Queue', count: `${tickets.length} Tickets`, icon: MessageSquareText },
          { id: 'settlements', label: 'Escrow Ledger', count: 'Audit Log', icon: Landmark },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.id)}
              className="p-3.5 rounded-2xl bg-[#14080c]/80 border border-gold-500/20 hover:border-gold-400/50 hover:bg-maroon-950/40 text-left transition-all group backdrop-blur-md shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1e0d13] border border-gold-500/25 flex items-center justify-center mb-2.5 group-hover:bg-gold-500/15 group-hover:border-gold-500/40 transition-colors">
                <Icon className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <p className="text-xs font-bold text-stone-200 group-hover:text-gold-300 transition-colors">{item.label}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{item.count}</p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* 4. Dual Section: Live Packages & Roadmap Delivery */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Catalog Overview */}
        <div className="lg:col-span-2 bg-[#14080c]/90 border border-gold-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-gold-500/15">
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>Live Ritual Packages</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-950 text-gold-300 border border-gold-500/30 font-semibold">
                  {packages.length} Active
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">Pre-assembled kits with customized item deductions</p>
            </div>
            <motion.button
              whileHover={{ x: 3 }}
              onClick={() => onNavigate('packages')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="mt-4 divide-y divide-gold-500/10">
            {packages.length === 0 ? (
              <p className="text-xs text-stone-500 py-8 text-center italic">
                No packages created yet. Use the "Assemble Kit" button above to bundle products.
              </p>
            ) : (
              packages.slice(0, 4).map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="py-3 px-2 rounded-xl flex items-center justify-between hover:bg-maroon-950/30 transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <h4 className="text-xs font-bold text-stone-200 truncate">{pkg.name}</h4>
                    <p className="text-[11px] text-stone-400 truncate max-w-md mt-0.5">
                      {pkg.description || 'Custom bundled ritual kit with dynamic samagri deduction'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-extrabold font-mono text-gold-400">
                      ₹{parseFloat(pkg.base_price).toFixed(2)}
                    </span>
                    <span className="block text-[9px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">
                      Kit Price
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Roadmap Delivery Complete Status */}
        <div className="bg-[#14080c]/90 border border-gold-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/15">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <span>System Roadmap</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Operational</span>
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { phase: 'Phase 1', title: 'Catalog & RBAC Auth Core', desc: 'PostgreSQL, JWT, products & packages' },
                { phase: 'Phase 2', title: 'Package Customization & Orders', desc: 'Dynamic price deduction & atomic stock' },
                { phase: 'Phase 3', title: 'Smart Zonal Pujari Dispatch', desc: 'Real-time broadcast & atomic locks' },
                { phase: 'Phase 4', title: 'Live Support Chat & Transcripts', desc: 'Ticket dispatch queue & audit inspector' },
                { phase: 'Phase 5', title: 'Shubarmbh Governance Control Room', desc: 'Directory, live tabs & responsive UI' },
                { phase: 'Phase 6', title: 'Escrow Settlements & OTP Audit', desc: 'Post-ceremony payout releases' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-maroon-950/30 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-300">{item.phase}: {item.title}</p>
                    <p className="text-[10px] text-stone-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gold-500/15 flex items-center justify-between text-[11px] text-stone-400">
            <span className="text-gold-300 font-semibold">Shubarmbh Devotional Ecosystem</span>
            <span className="text-emerald-400 font-mono font-bold">Localhost Active</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


