import React, { useState, useEffect } from 'react';
import { MessageSquareText, ShieldCheck, Send, UserCheck, Clock, RefreshCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

export default function SupportTickets({ tickets = [], onRefresh }) {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Auto-select first ticket if none selected
  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  // Load messages when selectedTicketId changes
  useEffect(() => {
    if (!selectedTicketId) return;

    const loadChat = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.getTicketMessages(selectedTicketId);
        if (res.success && res.data) {
          setActiveTicket(res.data.ticket);
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadChat();
  }, [selectedTicketId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicketId) return;

    setSending(true);
    try {
      const res = await api.sendTicketMessage(selectedTicketId, newMessage.trim());
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (err) {
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleAssignToRohan = async (ticketId) => {
    try {
      const res = await api.assignSupportTicket(ticketId, 4);
      if (res.success) {
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.updateTicketStatus(ticketId, newStatus);
      if (activeTicket && activeTicket.id === ticketId) {
        setActiveTicket({ ...activeTicket, status: newStatus });
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/15 via-slate-900/80 to-slate-900 border border-blue-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <MessageSquareText className="w-4 h-4" />
            <span>Support Governance & Live Chat Transcripts</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            Customer Tickets & Real-Time Audit Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Phase 4: Manage unassigned ticket queue, assign support executives, and inspect full chronological transcripts.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Queue</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List Queue */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-slate-950/40 flex flex-col h-[540px]">
          <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Support Ticket Queue
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold border border-slate-700">
              {tickets.length} Cases
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {tickets.length === 0 ? (
              <p className="p-10 text-center text-slate-500 italic">No support tickets found.</p>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicketId === t.id;
                const isUnassigned = !t.assigned_executive_id;

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-4 border-amber-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-amber-400">#{t.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          t.status === 'open'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : t.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <p className="font-bold text-slate-200 line-clamp-1">{t.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Devotee: {t.customer_name}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/50 text-[10px]">
                      {isUnassigned ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignToRohan(t.id);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold border border-blue-500/30 transition-all"
                        >
                          + Assign to Agent
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t.executive_name || 'Assigned'}</span>
                        </span>
                      )}

                      <span className="text-slate-500 font-mono">
                        {t.message_count || 0} msgs
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Chat Transcript Inspector */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl shadow-slate-950/40 flex flex-col justify-between h-[540px]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400 text-xs">
                  Ticket #{selectedTicketId || '—'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-sm">
                  {activeTicket?.subject || 'Live Chat Transcript Inspector'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Devotee: <span className="text-slate-300 font-medium">{activeTicket?.customer_name || 'Customer'}</span> · Assigned: <span className="text-amber-400 font-medium">{activeTicket?.executive_name || 'Unassigned Queue'}</span>
              </p>
            </div>

            {activeTicket && (
              <select
                value={activeTicket.status}
                onChange={(e) => handleStatusChange(activeTicket.id, e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}
          </div>

          {/* Transcript Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {loadingMessages ? (
              <p className="text-center text-xs text-slate-500 py-16">Loading transcript...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-16 italic">
                No chat messages exchanged in this ticket yet. Send the first response below.
              </p>
            ) : (
              messages.map((msg, mIdx) => {
                const isCustomer = msg.sender_role === 'customer';
                const isAdmin = msg.sender_role === 'admin';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(mIdx * 0.02, 0.2) }}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-bold text-slate-300">
                        {msg.sender_name}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-bold ${
                          isCustomer
                            ? 'bg-slate-800 text-slate-400'
                            : isAdmin
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {msg.sender_role}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                        isCustomer
                          ? 'bg-slate-800/90 text-slate-200 rounded-tl-sm border border-slate-700/60'
                          : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-100 border border-amber-500/30 rounded-tr-sm'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Chat Reply Form */}
          <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2.5">
            <input
              type="text"
              placeholder="Type an administrative reply to send to devotee & executive..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

