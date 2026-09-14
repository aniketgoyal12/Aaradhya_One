import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, icon: Icon, color = 'gold', delay = 0 }) {
  const colorMap = {
    gold: {
      gradient: 'from-gold-500/20 via-gold-900/10 to-[#14080c]',
      border: 'border-gold-500/30 group-hover:border-gold-400/50',
      text: 'text-gold-300',
      badge: 'bg-gold-500/15 text-gold-200 border-gold-500/30',
      glow: 'group-hover:bg-gold-500/20',
      iconBg: 'bg-gold-500/15 border-gold-500/40 text-gold-300',
    },
    amber: {
      gradient: 'from-amber-500/20 via-amber-900/10 to-[#14080c]',
      border: 'border-amber-500/30 group-hover:border-amber-400/50',
      text: 'text-amber-300',
      badge: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
      glow: 'group-hover:bg-amber-500/20',
      iconBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    },
    maroon: {
      gradient: 'from-maroon-800/30 via-maroon-950/20 to-[#14080c]',
      border: 'border-maroon-500/30 group-hover:border-maroon-400/50',
      text: 'text-rose-300',
      badge: 'bg-maroon-500/15 text-rose-200 border-maroon-500/30',
      glow: 'group-hover:bg-maroon-500/25',
      iconBg: 'bg-maroon-600/20 border-maroon-500/40 text-rose-300',
    },
    emerald: {
      gradient: 'from-emerald-600/20 via-emerald-950/15 to-[#14080c]',
      border: 'border-emerald-500/30 group-hover:border-emerald-400/50',
      text: 'text-emerald-300',
      badge: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
      glow: 'group-hover:bg-emerald-500/20',
      iconBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    },
    blue: {
      gradient: 'from-cyan-600/20 via-blue-950/15 to-[#14080c]',
      border: 'border-cyan-500/30 group-hover:border-cyan-400/50',
      text: 'text-cyan-300',
      badge: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30',
      glow: 'group-hover:bg-cyan-500/20',
      iconBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    },
    purple: {
      gradient: 'from-purple-600/20 via-purple-950/15 to-[#14080c]',
      border: 'border-purple-500/30 group-hover:border-purple-400/50',
      text: 'text-purple-300',
      badge: 'bg-purple-500/15 text-purple-200 border-purple-500/30',
      glow: 'group-hover:bg-purple-500/20',
      iconBg: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
    },
  };

  const scheme = colorMap[color] || colorMap.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative p-5 rounded-2xl bg-gradient-to-br ${scheme.gradient} border ${scheme.border} overflow-hidden backdrop-blur-xl shadow-lg transition-all duration-300`}
    >
      {/* Dynamic ambient hover glow */}
      <div 
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl transition-all duration-500 ${scheme.glow} opacity-60 pointer-events-none`} 
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${scheme.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50 font-mono">
          {value}
        </span>
        {change && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${scheme.badge} truncate`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}

