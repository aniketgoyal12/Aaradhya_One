import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950 overflow-hidden z-10`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
