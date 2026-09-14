import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import brandLogo from '../logo/Shubarmbh Pooja Essentials Logo(2).png';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@aaradhya.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const brandPillars = [
    'Pooja Items',
    'Ritual Essentials',
    'Spiritual Gifts',
    'Traditional Products'
  ];

  return (
    <div className="min-h-screen bg-[#0a0406] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-gold-500/30 selection:text-gold-200">
      {/* Background Decorative Ambient Diya Auras */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-gradient-to-tr from-maroon-800/20 via-gold-500/15 to-transparent rounded-full blur-[130px] pointer-events-none animate-diya" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gold-600/10 rounded-full blur-[100px] pointer-events-none animate-float" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header with Authentic Shubarmbh Logo */}
        <div className="text-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative inline-block mb-3 w-full"
          >
            {/* Glowing outer aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/30 via-maroon-700/40 to-gold-400/30 rounded-3xl blur-lg -z-10 animate-diya" />
            
            <div className="w-full max-w-[340px] mx-auto rounded-3xl bg-[#FAF5EE] p-3 sm:p-4 border-2 border-gold-400/60 shadow-2xl shadow-black/80 flex items-center justify-center">
              <img 
                src={brandLogo} 
                alt="Shubarmbh - Pooja Essentials For a Divine Life" 
                className="w-full h-auto max-h-44 object-contain filter drop-shadow-sm"
              />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-950/90 border border-gold-500/30 text-gold-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Devotional Governance Portal</span>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-[#14080c]/90 border border-gold-500/25 rounded-3xl p-7 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/90 ring-1 ring-gold-500/15">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gold-500/15">
            <div className="w-8 h-8 rounded-xl bg-maroon-950/80 border border-gold-500/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-100">Administrative Sign In</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Enter verified platform administrator credentials</p>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400/80 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aaradhya.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#0d0508] border border-gold-500/20 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 text-sm transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400/80 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[#0d0508] border border-gold-500/20 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 text-sm transition-all shadow-inner"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-stone-950 font-extrabold text-sm rounded-2xl transition-all duration-200 shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 pt-4 border-t border-gold-500/15 text-center">
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Strict RBAC enforcement enabled. Only accounts with role <code className="text-gold-400 font-mono font-bold">admin</code> are granted access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


