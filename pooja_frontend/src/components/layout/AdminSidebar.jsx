import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag,
  Radio, 
  MessageSquareText, 
  Landmark,
  LogOut, 
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import brandLogo from '../../logo/Shubarmbh Pooja Essentials Logo(2).png';

export default function AdminSidebar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  onToggleCollapse, 
  isMobileOpen, 
  onCloseMobile 
}) {
  const { user, logout } = useAuth();

  const navSections = [
    {
      group: 'Core Platform',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
        { id: 'products', label: 'Products Inventory', icon: Package, badge: 'Phase 1' },
        { id: 'packages', label: 'Pooja Packages', icon: Layers, badge: 'Phase 1' },
      ]
    },
    {
      group: 'Operations & Dispatch',
      items: [
        { id: 'orders', label: 'Orders & Masking', icon: ShoppingBag, badge: 'Phase 2' },
        { id: 'pujari-dispatch', label: 'Zonal Pujaris', icon: Radio, badge: 'Phase 3' },
        { id: 'support-tickets', label: 'Support & Transcripts', icon: MessageSquareText, badge: 'Phase 4' },
      ]
    },
    {
      group: 'Finance & Audit',
      items: [
        { id: 'settlements', label: 'Financial Settlements', icon: Landmark, badge: 'Phase 6' },
      ]
    }
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full relative overflow-hidden bg-gradient-to-b from-[#160b0f] via-[#100609] to-[#0a0406]">
      {/* Decorative subtle ambient divine glow in background */}
      <div className="absolute top-0 -left-12 w-48 h-48 bg-maroon-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-12 w-48 h-48 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP SECTION: Branding & Navigation */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-maroon-950">
        {/* Brand Header */}
        <div className={`p-3.5 border-b border-gold-500/15 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            {/* Shubarmbh Logo Container */}
            <div className="relative group/logo flex-shrink-0">
              <div className="w-11 h-11 rounded-xl bg-[#FAF5EE] p-0.5 border border-gold-400/50 flex items-center justify-center shadow-lg shadow-black/60 transition-transform duration-300 group-hover/logo:scale-105 group-hover/logo:border-gold-300 overflow-hidden">
                <img 
                  src={brandLogo} 
                  alt="Shubarmbh Logo" 
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              {/* Glow ping */}
              <div className="absolute -inset-0.5 rounded-xl bg-gold-500/20 blur-sm -z-10 group-hover/logo:bg-gold-500/40 transition-colors" />

              {/* Tooltip in collapsed mode */}
              {isCollapsed && (
                <div className="fixed left-20 px-3 py-1.5 rounded-lg bg-[#1a0b10] text-gold-200 text-xs font-semibold shadow-xl border border-gold-500/30 opacity-0 group-hover/logo:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                  Shubarmbh · शुभ आरंभ
                </div>
              )}
            </div>

            {/* Typography Header (Hidden in collapsed mode) */}
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="brand-regal text-lg font-bold tracking-wide text-gold-gradient">
                    Shubarmbh
                  </span>
                  <span className="text-[10px] font-bold text-amber-500/90 font-mono tracking-tight">
                    (TM)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8.5px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-maroon-900/50 text-gold-300 border border-gold-500/25 truncate">
                    Pooja Essentials
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button (Inside header) */}
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-gold-300/60 hover:text-gold-200 hover:bg-gold-500/10 transition-all hidden lg:flex items-center justify-center ${isCollapsed ? 'hidden' : ''}`}
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mobile Close Button (Visible on mobile screens) */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-maroon-950/80 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Categories */}
        <div className="p-3 space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {/* Category Title or Divider */}
              {!isCollapsed ? (
                <div className="px-3 pt-2 pb-1 text-[9.5px] font-extrabold uppercase tracking-widest text-gold-400/60 select-none">
                  {section.group}
                </div>
              ) : (
                <div className="my-2 border-t border-gold-500/10 mx-2" />
              )}

              {/* Items */}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <div key={item.id} className="relative group/item">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'
                      } rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                        isActive
                          ? 'bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 text-gold-100 font-semibold shadow-lg shadow-maroon-950/60 border border-gold-500/40'
                          : 'text-stone-300/80 hover:text-gold-200 hover:bg-gold-500/10'
                      }`}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                        <Icon 
                          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                            isActive ? 'text-gold-300 scale-110' : 'text-stone-400 group-hover/item:text-gold-300 group-hover/item:scale-105'
                          }`} 
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {/* Badge in expanded mode */}
                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold flex-shrink-0 ${
                            isActive
                              ? 'bg-gold-500/20 text-gold-200 border border-gold-400/30'
                              : 'bg-maroon-950/70 text-stone-400 border border-maroon-800/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Active indicator dot in collapsed mode */}
                      {isCollapsed && isActive && (
                        <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-gold-400 shadow-sm" />
                      )}
                    </button>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {isCollapsed && (
                      <div className="fixed left-20 px-3 py-1.5 rounded-lg bg-[#190a0f] text-stone-100 text-xs font-semibold shadow-2xl border border-gold-500/30 opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-maroon-900 text-gold-300 font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: Admin Profile & Logout */}
      <div className="relative z-10 p-3 border-t border-gold-500/15 bg-[#0d0508]/80 backdrop-blur-md">
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
          {/* Admin Avatar & Details */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative group/avatar flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-maroon-900 to-devotional-950 border border-gold-500/40 flex items-center justify-center shadow-inner ring-1 ring-gold-400/30">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0d0508]" />

              {/* Avatar Tooltip in collapsed mode */}
              {isCollapsed && (
                <div className="fixed left-20 px-3 py-1.5 rounded-lg bg-[#1a0b10] text-stone-100 text-xs shadow-xl border border-gold-500/30 opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap">
                  <p className="font-semibold text-gold-400">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-stone-400">{user?.email || 'admin@shubarmbh.com'}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="truncate min-w-0">
                <p className="text-xs font-semibold text-stone-200 truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gold-400/70 truncate">{user?.email || 'admin@shubarmbh.com'}</p>
              </div>
            )}
          </div>

          {/* Action Buttons: Expand Toggle or Logout */}
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-1'}`}>
            {isCollapsed && (
              <button
                onClick={onToggleCollapse}
                title="Expand Sidebar"
                className="p-1.5 text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={logout}
              title="Log Out Session"
              className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors group/logout relative"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover/logout:-translate-x-0.5" />
              {isCollapsed && (
                <div className="fixed left-20 px-3 py-1.5 rounded-lg bg-rose-950 text-rose-200 text-xs shadow-xl border border-rose-800 opacity-0 group-hover/logout:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap">
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sticky Sidebar with Smooth Width Transition */}
      <aside 
        className={`hidden lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        } border-r border-slate-800/80 flex flex-col justify-between backdrop-blur-2xl h-screen sticky top-0 transition-all duration-300 ease-in-out z-40`}
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer & Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-slate-950 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

