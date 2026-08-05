import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TransitionOverlay = ({ children, keyId }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
