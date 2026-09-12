import React from 'react';
import { motion } from 'framer-motion';

export const LoginGfgBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
    {/* Animated Emerald Ambient Glow Orbs */}
    <motion.div
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.2, 0.35, 0.2],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-[#2F8D46]/40 via-[#22C55E]/20 to-transparent blur-3xl"
    />

    <motion.div
      animate={{
        scale: [1.1, 0.9, 1.1],
        opacity: [0.15, 0.3, 0.15],
        x: [0, -40, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -bottom-32 -right-32 w-[42rem] h-[42rem] rounded-full bg-gradient-to-tl from-[#06B6D4]/30 via-[#2F8D46]/20 to-transparent blur-3xl"
    />

    {/* Floating GFG Brand Watermarks */}
    <motion.img
      src="/logos/gfg_kare_logo.png"
      alt=""
      animate={{ opacity: [0.03, 0.08, 0.03], scale: [0.95, 1.05, 0.95], rotate: [-3, 3, -3] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -right-16 top-1/3 -translate-y-1/2 w-[34rem] max-w-none opacity-5 filter grayscale invert"
    />

    <motion.img
      src="/logos/gfg_kare_logo.png"
      alt=""
      animate={{ opacity: [0.02, 0.06, 0.02], scale: [1.05, 0.95, 1.05], rotate: [4, -4, 4] }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute -left-20 -bottom-10 w-[30rem] max-w-none opacity-5 filter grayscale invert"
    />

    {/* Subtle Grid Texture */}
    <div className="absolute inset-0 cyber-grid opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0B131E]/60 via-[#0B131E]/40 to-[#0B131E]/90" />
  </div>
);
