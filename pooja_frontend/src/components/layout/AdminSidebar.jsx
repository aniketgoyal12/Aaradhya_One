import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag,
  Radio, 
  MessageSquareText, 
  LogOut, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ currentTab, setCurrentTab }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Products Inventory', icon: Package, badge: 'Live API' },
    { id: 'packages', label: 'Pooja Packages', icon: Layers, badge: 'Live API' },
    { id: 'orders', label: 'Orders & Customization', icon: ShoppingBag, badge: 'Phase 2' },
    { id: 'pujari-dispatch', label: 'Zonal Pujaris', icon: Radio, badge: 'Phase 3' },
    { id: 'support-tickets', label: 'Support & Chats', icon: MessageSquareText, badge: 'Phase 4' },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between backdrop-blur-xl h-screen sticky top-0">
      <div>
        {/* Typographic Brand Identity (Strictly No Image Logo per requirement) */}
        <div className="px-6 py-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="brand-devotional text-lg text-amber-400 font-bold tracking-wide">आराध्या</span>
                <span className="text-sm font-semibold tracking-tight text-slate-200">Aaradhya</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Admin Portal
                </span>
                <span className="text-[10px] text-slate-500">v1.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Catalog Governance
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : item.badge === 'Live API'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Session Info & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@aaradhya.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
