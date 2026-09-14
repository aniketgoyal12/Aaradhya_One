import React, { useState } from 'react';
import { Radio, Lock, CheckCircle2, ShieldCheck, Users, Plus, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/ui/Modal';
import { api } from '../api/client';

export default function PujariDispatch({ bookings = [], pujaris = [], onRefresh }) {
  const [activeTab, setActiveTab] = useState('broadcasts'); // 'broadcasts' | 'directory'
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Broadcast Form state
  const [newBroadcast, setNewBroadcast] = useState({
    order_id: 1,
    ceremony_name: '',
    zone: 'North-Delhi',
    payout_amount: 2100.00
  });

  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setFeedback(null);
    try {
      const res = await api.createPujariBooking(newBroadcast);
      if (res.success) {
        setFeedback('Zonal broadcast emitted successfully!');
        setIsBroadcastModalOpen(false);
        setNewBroadcast({ order_id: 1, ceremony_name: '', zone: 'North-Delhi', payout_amount: 2100.00 });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!selectedBookingForOtp) return;
    setLoadingAction(true);
    try {
      const res = await api.completePujariBooking(selectedBookingForOtp.id, otpInput);
      if (res.success) {
        setFeedback('Ceremony verified and escrow payout released!');
        setIsOtpModalOpen(false);
        setOtpInput('');
        setSelectedBookingForOtp(null);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert(`OTP verification failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1f0b12] via-[#16070b] to-[#0f0407] border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 backdrop-blur-xl shadow-2xl shadow-black/80">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Radio className="w-4 h-4 animate-pulse text-gold-400" />
            <span>Zonal Broadcast & Smart Pujari Dispatch</span>
          </div>
          <h2 className="brand-regal text-lg sm:text-xl font-bold text-gold-gradient">
            Real-Time Zonal Dispatch Engine
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl leading-relaxed">
            Atomic race-condition locks prevent duplicate acceptance. Escrow payouts are secured until customer OTP verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {feedback && (
            <span className="text-[11px] font-bold text-gold-300 bg-maroon-950/80 px-3 py-1.5 rounded-xl border border-gold-500/30 animate-fade-in">
              {feedback}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-stone-950 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 transition-all flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Emit Zonal Broadcast</span>
          </motion.button>
        </div>
      </div>

      {/* Animated Tab Switcher */}
      <div className="flex items-center justify-between border-b border-gold-500/15 pb-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'broadcasts'
                ? 'bg-maroon-950 text-gold-300 border border-gold-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#1a0b10]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-gold-400" />
            <span>Active Broadcasts ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-maroon-950 text-gold-300 border border-gold-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#1a0b10]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-gold-400" />
            <span>Pujari Directory ({pujaris.length})</span>
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          className="p-2 rounded-xl text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.button>
      </div>


      {/* Tab 1: Broadcasts Board */}
      {activeTab === 'broadcasts' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Booking / Ceremony</th>
                  <th className="py-3.5 px-4">Delivery Zone</th>
                  <th className="py-3.5 px-4">Assigned Pujari</th>
                  <th className="py-3.5 px-4">Escrow Payout</th>
                  <th className="py-3.5 px-4">Dispatch Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500 italic">
                      No active bookings or broadcasts in progress.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => {
                    const isCompleted = b.status === 'completed';
                    const isAccepted = b.status === 'accepted';
                    const isPending = b.status === 'pending';

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-200">
                            {b.ceremony_name || 'Vedic Pooja Ceremony'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Booking #{b.id} · Order #{b.order_id}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
                            {b.zone || 'North-Delhi'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {b.pujari_name ? (
                            <div>
                              <p className="font-semibold text-slate-200">{b.pujari_name}</p>
                              <p className="text-[11px] text-slate-400">{b.pujari_phone || 'Assigned'}</p>
                            </div>
                          ) : (
                            <span className="text-amber-400 text-[11px] italic">
                              Open Broadcast (Broadcasting...)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          ₹{parseFloat(b.payout_amount || 1500).toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                              <Radio className="w-3 h-3 animate-ping" />
                              Broadcasting to Zone
                            </span>
                          )}
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-semibold">
                              <Lock className="w-3 h-3" />
                              Locked: Accepted
                            </span>
                          )}
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed & Paid
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isAccepted && (
                            <button
                              onClick={() => {
                                setSelectedBookingForOtp(b);
                                setOtpInput(b.otp || '');
                                setIsOtpModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg text-amber-400 hover:text-slate-950 bg-amber-500/10 hover:bg-amber-400 text-[11px] font-bold border border-amber-500/20 transition-all inline-flex items-center gap-1"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Verify OTP</span>
                            </button>
                          )}
                          {isCompleted && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              OTP: {b.otp || 'Verified'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Pujari Directory */}
      {activeTab === 'directory' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Pujari Name / Contact</th>
                  <th className="py-3.5 px-4">Assigned Delivery Zone</th>
                  <th className="py-3.5 px-4">Completed Ceremonies</th>
                  <th className="py-3.5 px-4">Active Assignments</th>
                  <th className="py-3.5 px-4">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {pujaris.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500 italic">
                      No verified Pujaris registered in directory.
                    </td>
                  </tr>
                ) : (
                  pujaris.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-xs">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{p.name}</p>
                            <p className="text-[11px] text-slate-400">{p.email} · {p.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-semibold text-[11px] border border-slate-700">
                          {p.zone || 'Central'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {p.completed_ceremonies || 0} ceremonies
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {p.active_bookings || 0} active
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Online & Ready
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Emit New Broadcast */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Emit Open Zonal Broadcast"
      >
        <form onSubmit={handleCreateBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Ceremony Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Satyanarayan Mahapooja or Griha Pravesh"
              value={newBroadcast.ceremony_name}
              onChange={(e) => setNewBroadcast({ ...newBroadcast, ceremony_name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Delivery Zone *
              </label>
              <select
                value={newBroadcast.zone}
                onChange={(e) => setNewBroadcast({ ...newBroadcast, zone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="North-Delhi">North-Delhi</option>
                <option value="South-Delhi">South-Delhi</option>
                <option value="West-Delhi">West-Delhi</option>
                <option value="East-Delhi">East-Delhi</option>
                <option value="NCR-Noida">NCR-Noida</option>
                <option value="NCR-Gurugram">NCR-Gurugram</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Payout Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={newBroadcast.payout_amount}
                onChange={(e) => setNewBroadcast({ ...newBroadcast, payout_amount: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            📡 <strong>Real-Time Broadcast:</strong> Clicking publish emits a <code>NEW_POOJA_REQUEST</code> to all connected Pujaris in the target zone room via Socket.io.
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsBroadcastModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingAction}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl"
            >
              {loadingAction ? 'Broadcasting...' : 'Broadcast to Zone'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Verify OTP */}
      <Modal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        title="Verify Ceremony OTP & Release Payout"
      >
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-xs text-slate-300">
            Enter the 6-digit verification code provided to the devotee at booking acceptance:
          </p>

          <div>
            <input
              type="text"
              required
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="e.g. 470647"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xl font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            💰 Submitting the correct OTP completes the ceremony and triggers immediate escrow payout release to the assigned Pujari.
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsOtpModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingAction}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl"
            >
              {loadingAction ? 'Verifying...' : 'Verify & Release Payout'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}

