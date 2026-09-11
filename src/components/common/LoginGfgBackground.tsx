import React from 'react';
import { motion } from 'framer-motion';

export const LoginGfgBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <motion.img
      src="/gfg-logo.svg"
      alt=""
      animate={{ opacity: [0.035, 0.09, 0.035], scale: [0.92, 1.04, 0.92], rotate: [-4, 4, -4] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -right-24 top-1/2 -translate-y-1/2 w-[48rem] max-w-none drop-shadow-2xl"
    />
    <motion.img
      src="/gfg-logo.svg"
      alt=""
      animate={{ opacity: [0.025, 0.065, 0.025], scale: [1.05, 0.92, 1.05], rotate: [6, -5, 6] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -left-32 -bottom-24 w-[42rem] max-w-none drop-shadow-2xl"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-pink-100/40" />
  </div>
);

