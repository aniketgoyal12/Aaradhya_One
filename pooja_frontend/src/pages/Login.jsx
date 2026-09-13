import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header (No image logo) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 shadow-xl shadow-amber-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="brand-devotional text-3xl text-amber-400 font-bold tracking-wide">आराध्या</h1>
            <span className="text-2xl font-bold tracking-tight text-slate-100">Aaradhya</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mt-1">
            Admin Governance Portal
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-slate-950">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200">Administrative Sign In</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aaradhya.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Strict RBAC enforcement enabled. Only accounts with role <code className="text-amber-400 font-mono">admin</code> are granted governance access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
