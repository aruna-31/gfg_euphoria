import React from 'react';
import { motion } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 overflow-hidden bg-[#fffafd] text-[#171a2b] flex items-center justify-center">
    <div className="absolute inset-0 cyber-grid opacity-60" />
    <motion.img src="/gfg-logo.svg" alt="" aria-hidden="true" animate={{ x: [-35, 35, -35], y: [-18, 20, -18], rotate: [-5, 4, -5], opacity: [0.035, 0.10, 0.035] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-20 -top-20 w-[34rem] max-w-none" />
    <motion.img src="/gfg-logo.svg" alt="" aria-hidden="true" animate={{ x: [35, -30, 35], y: [22, -18, 22], rotate: [5, -4, 5], opacity: [0.035, 0.09, 0.035] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-20 -bottom-20 w-[38rem] max-w-none" />
    <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.34, 0.18] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute w-[38rem] h-[38rem] rounded-full bg-pink-300/40 blur-[120px]" />
    <main className="relative z-10 px-6 text-center">
      <motion.img initial={{ opacity: 0, scale: 0.65, y: -18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }} src="/gfg-logo.svg" alt="GeeksforGeeks" className="w-44 h-24 object-contain mx-auto mb-8 drop-shadow-xl" />
      <motion.h1 initial={{ opacity: 0, letterSpacing: '0.35em', y: 16 }} animate={{ opacity: 1, letterSpacing: '0em', y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
        <span className="bg-gradient-to-r from-[#197a35] via-[#2F8D46] to-[#e34891] bg-clip-text text-transparent">Hackodessey</span><br />
        <motion.span animate={{ textShadow: ['0 0 0 rgba(219,39,119,0)', '0 0 28px rgba(219,39,119,.34)', '0 0 0 rgba(219,39,119,0)'] }} transition={{ duration: 2.4, repeat: Infinity }} className="text-[#db2777]">4.0</motion.span>
      </motion.h1>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.85 }} className="h-1 w-40 mx-auto mt-6 rounded-full bg-gradient-to-r from-[#2F8D46] via-pink-400 to-[#db2777]" />
      <motion.button initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.05 }} whileHover={{ scale: 1.06, boxShadow: '0 16px 34px rgba(219,39,119,.30)' }} whileTap={{ scale: 0.96 }} onClick={onComplete} className="mt-10 px-10 py-3 rounded-full bg-gradient-to-r from-[#2F8D46] to-[#db2777] text-white text-sm font-bold tracking-wide shadow-lg cursor-pointer">Enter</motion.button>
    </main>
  </motion.div>
);
