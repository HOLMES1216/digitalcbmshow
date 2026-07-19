import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function PageContainer({ children, id }: { children: React.ReactNode; id: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full flex flex-col pt-20 pb-24 overflow-hidden bg-[#002b6b] text-white"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
