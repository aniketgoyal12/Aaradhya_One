import React, { useState } from 'react';
import { MessageSquareText, ShieldCheck, UserCheck, Clock, Send } from 'lucide-react';

export default function SupportTickets() {
  const [selectedTicket, setSelectedTicket] = useState('TCK-8821');

  const sampleTickets = [
    { id: 'TCK-8821', customer: 'Vipin Mehra', issue: 'Question about clay idol delivery timing', status: 'In Progress', executive: 'Rohan (Support)', time: '10m ago' },
    { id: 'TCK-8822', customer: 'Sunita Rao', issue: 'Pujari language preference modification', status: 'Unassigned', executive: null, time: '25m ago' },
    { id: 'TCK-8823', customer: 'Anand Kulkarni', issue: 'Payment receipt & GST invoice download', status: 'Resolved', executive: 'Priya (Support)', time: '2h ago' },
  ];

  const sampleMessages = [
    { sender: 'customer', name: 'Vipin Mehra', text: 'Namaste, I booked the Ganesha Chaturthi kit. Will the clay idol arrive 24 hours prior to the muhurat?', time: '10:14 AM' },
    { sender: 'executive', name: 'Rohan (Support Executive)', text: 'Namaste Vipin ji! Yes, all sacred idols and samagri kits are guaranteed delivered at least 18-24 hours prior to the scheduled pooja time.', time: '10:16 AM' },
    { sender: 'customer', name: 'Vipin Mehra', text: 'Wonderful, thank you so much for confirming!', time: '10:17 AM' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
        <MessageSquareText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-blue-300">Phase 4 Live Chat Transcripts & Support Queue (Ready for Integration)</h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Admin Governance allows full audit visibility into customer conversations, queue assignment, and executive SLA enforcement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Support Ticket Queue</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">3 Cases</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {sampleTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTicket === t.id ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-200">{t.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      t.status === 'Unassigned'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : t.status === 'In Progress'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-200">{t.customer}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{t.issue}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50 text-[10px] text-slate-500">
                  <span>{t.executive || 'Unassigned Queue'}</span>
                  <span>{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Transcript Viewer */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[480px]">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-200 text-xs">{selectedTicket}</span>
                <span className="text-xs font-semibold text-slate-300">Live Transcript Inspection</span>
              </div>
              <p className="text-[11px] text-slate-400">Customer: Vipin Mehra · Assigned: Rohan (Support)</p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Auditor View</span>
            </div>
          </div>

          {/* Transcript Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {sampleMessages.map((msg, i) => {
              const isCust = msg.sender === 'customer';
              return (
                <div key={i} className={`flex flex-col ${isCust ? 'items-start' : 'items-end'}`}>
                  <span className="text-[10px] text-slate-500 mb-1 px-1">
                    {msg.name} · {msg.time}
                  </span>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isCust
                        ? 'bg-slate-800 text-slate-200 rounded-tl-sm'
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
            <span>Read-only transcript mode. Support executives communicate directly in Socket.io room <code>ticket:{selectedTicket}</code>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
