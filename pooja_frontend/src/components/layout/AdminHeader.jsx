import React from 'react';
import { Shield, RefreshCw, Menu, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react';

export default function AdminHeader({ 
  title, 
  subtitle, 
  onRefresh, 
  isCollapsed, 
  onToggleSidebar, 
  onOpenMobileSidebar 
}) {
  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-gold-500/15 bg-[#12070a]/85 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/40">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-1.5 rounded-xl text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 lg:hidden transition-all duration-200"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 hidden lg:flex transition-all duration-200"
          title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-gold-400/80" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-stone-400" />
          )}
        </button>

        <div className="h-5 w-px bg-gold-500/20 hidden sm:block" />

        <div>
          <h1 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-xs text-stone-400 hidden sm:block truncate max-w-md lg:max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global manual refresh trigger */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 text-xs font-medium text-stone-300 bg-[#1e0d13] hover:bg-maroon-900/60 hover:text-gold-200 rounded-xl border border-gold-500/20 hover:border-gold-500/40 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
            title="Refresh active dataset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        )}

        {/* Admin Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-maroon-900/50 via-[#1f0d14] to-gold-950/40 border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden xs:inline">Role:</span>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

