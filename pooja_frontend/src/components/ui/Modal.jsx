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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className={`relative w-full ${maxWidth} bg-[#14080c]/98 border border-gold-500/30 rounded-3xl shadow-2xl shadow-black/95 overflow-hidden z-10 backdrop-blur-2xl ring-1 ring-gold-500/20 my-8`}
          >
            {/* Header with warm ambient accent */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-gold-500/15 bg-[#1a0b10]/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-stone-100">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 transition-all duration-200"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[78vh] overflow-y-auto scrollbar-thin scrollbar-thumb-maroon-950">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

