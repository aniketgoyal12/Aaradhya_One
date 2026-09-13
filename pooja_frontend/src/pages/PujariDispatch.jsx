import React from 'react';
import { Radio, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

export default function PujariDispatch() {
  const sampleZonalFeed = [
    { id: 'REQ-101', ceremony: 'Satyanarayan Katha', zone: 'North-Delhi', status: 'broadcast_active', devotees: 'Sharma Family', payout: '₹2,100' },
    { id: 'REQ-102', ceremony: 'Griha Pravesh Mahapooja', zone: 'South-Delhi', status: 'accepted', pujari: 'Acharya Ramesh Sharma', payout: '₹5,100' },
    { id: 'REQ-103', ceremony: 'Navchandi Yagya', zone: 'West-Delhi', status: 'completed', pujari: 'Pandit Dinesh Shastri', payout: '₹7,500' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <Radio className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h3 className="text-sm font-bold text-amber-300">Phase 3 Zonal Broadcast Engine (Ready for Integration)</h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            When customer bookings request an open broadcast, a WebSocket notification (<code>NEW_POOJA_REQUEST</code>) is dispatched to all Pujaris matching the delivery zone. Redis distributed locks (<code>SETNX</code>) ensure atomic single-acceptance.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Zonal Dispatch Monitoring Board</h3>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Sample Active Broadcasts</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {sampleZonalFeed.map((req) => (
            <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-200">{req.id}</span>
                  <span className="text-slate-100 font-semibold">{req.ceremony}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium">
                    Zone: {req.zone}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Devotee: {req.devotees} · Payout: <span className="font-mono text-amber-400 font-semibold">{req.payout}</span> (Escrow protected)
                </p>
              </div>

              <div>
                {req.status === 'broadcast_active' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold flex items-center gap-1.5">
                    <Radio className="w-3 h-3 animate-ping" />
                    Broadcasting to Pujaris
                  </span>
                )}
                {req.status === 'accepted' && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Locked: {req.pujari}
                  </span>
                )}
                {req.status === 'completed' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed & Released
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
