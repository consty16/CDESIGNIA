import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-white/5 backdrop-blur-xl z-20">
              <h2 className="font-serif text-xl md:text-2xl font-light text-text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 border border-lilac/20 text-text-muted hover:text-lilac hover:border-lilac flex items-center justify-center transition-all rounded"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
