import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, icon: Icon, color = 'amber' }) {
  const colorMap = {
    amber: {
      bg: 'from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-300',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-300',
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-300',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-300',
    },
  };

  const scheme = colorMap[color] || colorMap.amber;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${scheme.bg} border ${scheme.border} relative overflow-hidden backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${scheme.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-slate-100">{value}</span>
        {change && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${scheme.badge}`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}
