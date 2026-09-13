import React, { useState } from 'react';
import { ShoppingBag, Eye, Radio, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
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
    placed: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
    confirmed: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: CheckCircle2 },
    completed: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    cancelled: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: XCircle },
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Customer Orders & Customization Governance</h2>
          <p className="text-xs text-slate-400">
            Phase 2: Inspect dynamic price deductions, customer removed items, and manage order lifecycles.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Phase 2 Engine Live</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Order / Customer</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Custom Removals</th>
                <th className="py-3.5 px-4">Final Paid</th>
                <th className="py-3.5 px-4">Pujari Request</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 italic">
                    No orders placed on the platform yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const StatusIcon = statusBadges[o.status]?.icon || Clock;
                  const statusStyle = statusBadges[o.status]?.bg || 'bg-slate-800 text-slate-400';

                  return (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
                            #{o.id}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{o.customer_name || 'Customer'}</p>
                            <p className="text-[11px] text-slate-400">{o.customer_email || 'No email'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">
                          {o.package_name || 'Custom Pooja Kit'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {Number(o.removed_items_count) > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[11px] font-medium border border-amber-500/20">
                            {o.removed_items_count} items removed (Deducted)
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Full bundle (0 removals)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₹{parseFloat(o.total_amount).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        {o.needs_pujari ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Radio className="w-3 h-3 animate-pulse" />
                            Pujari Requested
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Items Only</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusStyle}`}
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled (Restore Stock)</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleInspectOrder(o.id)}
                          className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
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
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Customer</p>
                <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedOrder.customer_name}</p>
                <p className="text-[11px] text-slate-400">{selectedOrder.customer_email} · {selectedOrder.customer_phone || 'No phone'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Paid</p>
                <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}
                </p>
                <p className="text-[11px] text-slate-400">
                  Status: <span className="font-semibold uppercase text-slate-300">{selectedOrder.status}</span>
                </p>
              </div>
            </div>

            {/* Items Breakdown with Masked Deduction Flags */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Customized Kit Items ({selectedOrder.items?.length || 0})
              </h4>

              <div className="border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 flex items-center justify-between text-xs ${
                      item.removed ? 'bg-slate-950/60 opacity-60' : 'bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${item.removed ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                      <div>
                        <p className={`font-semibold ${item.removed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {item.product_name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {item.removed ? 'Possessed by devotee at home (Deducted from total)' : 'Included in package delivery'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      {item.removed ? (
                        <span className="text-amber-400 text-[11px]">
                          -₹{parseFloat(item.price_at_order).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[11px]">
                          ₹{parseFloat(item.price_at_order).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.needs_pujari && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>Linked Pujari Booking Active</span>
                </span>
                <span className="font-semibold uppercase tracking-wider text-[10px] bg-purple-500/20 px-2 py-0.5 rounded">
                  Status: {selectedOrder.pujari_booking_status || 'Pending Broadcast'}
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
