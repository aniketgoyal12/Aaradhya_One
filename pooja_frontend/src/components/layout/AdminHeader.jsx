import React, { useState, useEffect } from 'react';
import { Shield, Activity, RefreshCw } from 'lucide-react';
import { api } from '../../api/client';

export default function AdminHeader({ title, subtitle, onRefresh }) {
  const [apiOnline, setApiOnline] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      // Testing with lightweight products endpoint
      await api.getProducts();
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 px-8 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Backend API Connection Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              apiOnline === true
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                : apiOnline === false
                ? 'bg-rose-500 shadow-sm shadow-rose-500'
                : 'bg-amber-400 animate-pulse'
            }`}
          />
          <span className="text-slate-300 font-medium">
            {apiOnline === true ? 'Backend API Active' : apiOnline === false ? 'API Offline (Port 5000)' : 'Connecting...'}
          </span>
          <button
            onClick={checkHealth}
            disabled={checking}
            className="p-1 hover:text-amber-400 text-slate-400 transition-colors"
            title="Recheck backend connection"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Global manual refresh trigger if passed */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Refresh Data
          </button>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Role: Admin</span>
        </div>
      </div>
    </header>
  );
}
