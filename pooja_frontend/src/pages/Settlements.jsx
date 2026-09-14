import React, { useState } from 'react';
import { Landmark, ShieldCheck, ArrowUpRight, CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/ui/StatCard';
import { api } from '../api/client';

export default function Settlements({ data, onRefresh }) {
  const [releasingId, setReleasingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const stats = data?.stats || {
    total_gmv: '0.00',
    total_escrow_held: '0.00',
    total_payouts_released: '0.00',
    total_transactions: 0
  };

  const transactions = data?.transactions || [];

  const handleManualRelease = async (bookingId) => {
    if (!window.confirm(`Release escrow payout for Booking #${bookingId}?`)) return;
    setReleasingId(bookingId);
    setFeedbackMsg(null);
    try {
      const res = await api.releaseEscrowPayout(bookingId);
      if (res.success) {
        setFeedbackMsg(`Escrow payout released successfully! Ref: ${res.data.transaction_ref}`);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
            <span>Financial Audit & Escrow Ledger</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-950 text-gold-300 border border-gold-500/30 font-semibold">
              Live Escrow Engine
            </span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Phase 6: Comprehensive ledger tracking GMV, pending escrow holdings, and post-ceremony payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {feedbackMsg && (
            <span className="text-[11px] font-bold text-gold-300 bg-maroon-950/80 px-3 py-1.5 rounded-xl border border-gold-500/30">
              {feedbackMsg}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-2xl bg-[#1e0d13] hover:bg-maroon-900/60 border border-gold-500/20 text-stone-200 hover:text-gold-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
            <span>Sync Ledger</span>
          </motion.button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Platform GMV"
          value={`₹${parseFloat(stats.total_gmv).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change="Orders Total"
          icon={ArrowUpRight}
          color="gold"
          delay={0}
        />
        <StatCard
          title="Escrow In Custody"
          value={`₹${parseFloat(stats.total_escrow_held).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change="Safely Held"
          icon={Clock}
          color="maroon"
          delay={0.06}
        />
        <StatCard
          title="Pujari Payouts Released"
          value={`₹${parseFloat(stats.total_payouts_released).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change="Post-OTP Verified"
          icon={CheckCircle2}
          color="emerald"
          delay={0.12}
        />
        <StatCard
          title="Audited Entries"
          value={stats.total_transactions}
          change="Ledger Transactions"
          icon={ShieldCheck}
          color="amber"
          delay={0.18}
        />
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-[#14080c]/90 border border-gold-500/20 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-500/15 bg-[#1a0b10]/90 text-[11px] font-bold uppercase tracking-wider text-gold-400/80">
                <th className="py-4 px-5">Ref / ID</th>
                <th className="py-4 px-5">Booking Ceremony</th>
                <th className="py-4 px-5">Beneficiary Pujari</th>
                <th className="py-4 px-5">Escrow Amount</th>
                <th className="py-4 px-5">Settlement Status</th>
                <th className="py-4 px-5 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10 text-xs">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                    No escrow transaction records in ledger yet.
                  </td>
                </tr>
              ) : (
                transactions.map((txn, idx) => {
                  const isReleased = txn.status === 'released';
                  return (
                    <motion.tr 
                      key={txn.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {txn.transaction_ref || `ESCROW-${txn.id}`}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                          {txn.ceremony_name || 'Vedic Pooja Ceremony'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Booking #{txn.booking_id} · Zone: <span className="text-amber-300">{txn.zone || 'General'}</span>
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        {txn.pujari_name ? (
                          <div>
                            <p className="font-bold text-slate-200">{txn.pujari_name}</p>
                            <p className="text-[11px] text-slate-400">{txn.pujari_phone || 'Assigned'}</p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-400/80 italic font-medium">
                            Unclaimed (Awaiting Zonal Acceptance)
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 font-mono font-extrabold text-emerald-400 text-sm">
                        ₹{parseFloat(txn.amount).toFixed(2)}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            isReleased
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isReleased ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                          {isReleased ? 'Payout Released' : 'Held in Escrow'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        {!isReleased ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleManualRelease(txn.booking_id)}
                            disabled={releasingId === txn.booking_id}
                            className="px-3 py-1.5 rounded-xl text-slate-950 font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[11px] transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
                          >
                            {releasingId === txn.booking_id ? 'Releasing...' : 'Release Payout'}
                          </motion.button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Released {txn.released_at ? new Date(txn.released_at).toLocaleDateString() : 'Yes'}
                          </span>
                        )}
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

