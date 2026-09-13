import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ currentTab, setCurrentTab, title, subtitle, onRefresh, children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={title} subtitle={subtitle} onRefresh={onRefresh} />

        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
