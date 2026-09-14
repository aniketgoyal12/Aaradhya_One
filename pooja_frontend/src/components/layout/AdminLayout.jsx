import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ currentTab, setCurrentTab, title, subtitle, onRefresh, children }) {
  // Desktop collapse state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('aaradhya_admin_sidebar_collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist desktop collapse state
  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('aaradhya_admin_sidebar_collapsed', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0406] text-stone-100 selection:bg-gold-500/30 selection:text-gold-200 relative overflow-x-hidden">
      {/* Subtle ambient divine glow in layout background */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-maroon-900/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[30rem] h-[30rem] bg-gold-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <AdminSidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <AdminHeader 
          title={title} 
          subtitle={subtitle} 
          onRefresh={onRefresh}
          isCollapsed={isCollapsed}
          onToggleSidebar={handleToggleCollapse}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

