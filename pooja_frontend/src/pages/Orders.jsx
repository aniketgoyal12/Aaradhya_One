import React, { useState } from 'react';
import { ShoppingBag, Eye, Radio, CheckCircle2, Clock, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/ui/Modal';
import { api } from '../api/client';

export default function Orders({ orders = [], onStatusUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleInspectOrder = async (orderId) => {
    setLoadingDetail(true);
    try {
      const res = await api.getOrderById(orderId);
      if (res.success && res.data) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await onStatusUpdate(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadges = {
    placed: { bg: 'bg-gold-500/15 text-gold-300 border-gold-500/30', icon: Clock },
    confirmed: { bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: CheckCircle2 },
    completed: { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
    cancelled: { bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: XCircle },
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
            <span>Customer Orders & Customization Governance</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-950 text-gold-300 border border-gold-500/30 font-semibold">
              {orders.length} Total Orders
            </span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Inspect dynamic price deductions, devotee item removals, and transactional lifecycles.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Orders Engine Live</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#14080c]/90 border border-gold-500/20 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-500/15 bg-[#1a0b10]/90 text-[11px] font-bold uppercase tracking-wider text-gold-400/80">
                <th className="py-4 px-5">Order ID & Devotee</th>
                <th className="py-4 px-5">Package Kit</th>
                <th className="py-4 px-5">Deduction Status</th>
                <th className="py-4 px-5">Final Paid</th>
                <th className="py-4 px-5">Pujari Requested</th>
                <th className="py-4 px-5">Order Status</th>
                <th className="py-4 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10 text-xs">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500 italic">
                    No orders placed on the platform yet.
                  </td>
                </tr>
              ) : (
                orders.map((o, idx) => {
                  const StatusIcon = statusBadges[o.status]?.icon || Clock;
                  const statusStyle = statusBadges[o.status]?.bg || 'bg-[#1e0d13] text-stone-400';

                  return (
                    <motion.tr 
                      key={o.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                      className="hover:bg-maroon-950/30 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#1f0d13] border border-gold-500/25 flex items-center justify-center font-mono font-bold text-gold-300 text-xs shadow-inner">
                            #{o.id}
                          </div>
                          <div>
                            <p className="font-bold text-stone-200 group-hover:text-gold-300 transition-colors">{o.customer_name || 'Customer'}</p>
                            <p className="text-[11px] text-stone-400">{o.customer_email || 'No email'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-semibold text-stone-200">
                          {o.package_name || 'Shubarmbh Pooja Kit'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {Number(o.removed_items_count) > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-300 text-[11px] font-bold border border-gold-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                            {o.removed_items_count} removed (Deducted)
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400 font-medium">
                            Full bundle (0 removals)
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 font-mono font-extrabold text-gold-300 text-sm">
                        ₹{parseFloat(o.total_amount).toFixed(2)}
                      </td>

                      <td className="py-4 px-5">
                        {o.needs_pujari ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-maroon-950 text-gold-300 text-[11px] font-bold border border-gold-500/30">
                            <Radio className="w-3 h-3 animate-pulse text-gold-400" />
                            <span>Requested</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-500">None</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <select
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-xl border focus:outline-none transition-all cursor-pointer ${statusStyle} bg-[#0d0508]`}
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleInspectOrder(o.id)}
                          className="p-2 rounded-xl text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                          title="Inspect Order Deductions"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Breakdown: #${selectedOrder.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {/* Customer & Order Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#0d0508] border border-gold-500/20">
                <p className="text-[10px] text-gold-400/80 uppercase tracking-widest font-bold">Customer</p>
                <p className="text-sm font-bold text-stone-200 mt-1">{selectedOrder.customer_name}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{selectedOrder.customer_email} · {selectedOrder.customer_phone || 'No phone'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0508] border border-gold-500/20">
                <p className="text-[10px] text-gold-400/80 uppercase tracking-widest font-bold">Total Paid</p>
                <p className="text-lg font-extrabold font-mono text-gold-300 mt-1">
                  ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Status: <span className="font-bold uppercase text-gold-300">{selectedOrder.status}</span>
                </p>
              </div>
            </div>

            {/* Items Breakdown with Masked Deduction Flags */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400/90 mb-2">
                Customized Kit Items ({selectedOrder.items?.length || 0})
              </h4>

              <div className="border border-gold-500/20 rounded-2xl divide-y divide-gold-500/10 overflow-hidden bg-[#0d0508]/60">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                      item.removed ? 'bg-[#0a0406]/80 opacity-60' : 'bg-[#14080c]/60 hover:bg-maroon-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.removed ? 'bg-rose-500 ring-2 ring-rose-500/20' : 'bg-emerald-400 ring-2 ring-emerald-400/20'}`} />
                      <div>
                        <p className={`font-bold ${item.removed ? 'line-through text-stone-400' : 'text-stone-200'}`}>
                          {item.product_name}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {item.removed ? 'Possessed by devotee at home (Deducted from total)' : 'Included in package delivery'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      {item.removed ? (
                        <span className="text-gold-400 font-bold text-xs">
                          -₹{parseFloat(item.price_at_order).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-stone-300 text-xs">
                          ₹{parseFloat(item.price_at_order).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.needs_pujari && (
              <div className="p-3.5 rounded-2xl bg-maroon-950/70 border border-gold-500/25 text-xs text-gold-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-gold-400 animate-pulse" />
                  <span className="font-semibold">Linked Pujari Booking Active</span>
                </span>
                <span className="font-bold uppercase tracking-wider text-[10px] bg-maroon-900/60 px-2.5 py-1 rounded-full border border-gold-500/30 text-gold-300">
                  Status: {selectedOrder.pujari_booking_status || 'Pending Broadcast'}
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

