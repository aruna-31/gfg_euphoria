import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';

export const OperationsLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const clubs = [
    {
      id: 'gfg',
      name: 'GFG KARE',
      fullName: 'GeeksforGeeks Campus Body KARE',
      src: '/logos/gfg_kare_logo.png',
      angle: 0,
      glow: 'shadow-[0_0_24px_rgba(34,197,94,0.6)] border-emerald-400',
      tagColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/80',
    },
    {
      id: 'ieee',
      name: 'IEEE KARE',
      fullName: 'IEEE Student Branch',
      src: '/logos/kare_ieee_logo.jpg',
      angle: 72,
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.6)] border-cyan-400',
      tagColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/80',
    },
    {
      id: 'acm',
      name: 'ACM KARE',
      fullName: 'ACM Student Chapter',
      src: '/logos/kare_acm_logo.jpg',
      angle: 144,
      glow: 'shadow-[0_0_24px_rgba(59,130,246,0.6)] border-blue-400',
      tagColor: 'text-blue-300 border-blue-500/40 bg-blue-950/80',
    },
    {
      id: 'acmw',
      name: 'ACM-W',
      fullName: 'ACM-W Chapter',
      src: '/logos/kare_acmw_logo.jpg',
      angle: 216,
      glow: 'shadow-[0_0_24px_rgba(236,72,153,0.6)] border-pink-400',
      tagColor: 'text-pink-300 border-pink-500/40 bg-pink-950/80',
    },
    {
      id: 'gdg',
      name: 'GDG KARE',
      fullName: 'Google Developer Groups',
      src: '/logos/gdg_logo.png',
      angle: 288,
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.6)] border-amber-400',
      tagColor: 'text-amber-300 border-amber-500/40 bg-amber-950/80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070D14] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      <LoginGfgBackground />

      {/* Cosmic Starfield & Ambient Glows */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F1E2E]/90 border border-emerald-500/35 shadow-lg shadow-emerald-950/50 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
          <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider">
            Made by GEEKS FOR GEEKS
          </span>
        </div>
      </motion.div>

      {/* Central Solar System Arena */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
        {/* Orbital System Container */}
        <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
          {/* Planetary Orbital Rings */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.08)] pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-dashed border-cyan-500/20 pointer-events-none animate-spin-slow opacity-60" />
          <div className="absolute inset-16 rounded-full border border-emerald-500/15 pointer-events-none" />

          {/* Central Sun / Core Branding */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative z-20 flex flex-col items-center justify-center text-center p-5 rounded-full bg-[#0B1520]/95 border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(34,197,94,0.35)] backdrop-blur-2xl w-40 h-40 sm:w-52 sm:h-52"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg shadow-emerald-950/60 mb-2">
              <img
                src="/logos/gfg_kare_logo.png"
                alt="GeeksforGeeks KARE"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-tight font-['Outfit',sans-serif] leading-tight">
              Hackodyssey <span className="text-emerald-400 font-mono">4.0</span>
            </h1>
            <p className="text-[9px] sm:text-[11px] font-mono text-cyan-300/90 font-bold mt-1 tracking-wider uppercase">
              Operations Directorate
            </p>
          </motion.div>

          {/* 5 Orbiting Club Planets */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {clubs.map((club) => {
              const radius = 165;
              const rad = ((club.angle - 90) * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              return (
                <div
                  key={club.id}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute pointer-events-auto"
                >
                  {/* Counter-rotate planet content so logo stays upright */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white p-1.5 flex items-center justify-center border-2 transition-transform duration-300 hover:scale-125 ${club.glow}`}
                    >
                      <img
                        src={club.src}
                        alt={club.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span
                      className={`mt-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border backdrop-blur-md whitespace-nowrap shadow-md ${club.tagColor}`}
                    >
                      {club.name}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </main>

      {/* Bottom Enter Buttons & Credits */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-3 pb-4">
        <div className="grid grid-cols-2 gap-3 w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/login/evaluator')}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 border border-amber-400/40 cursor-pointer"
          >
            <span>EVALUATOR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/login/admin')}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 border border-cyan-400/40 cursor-pointer"
          >
            <span>ADMIN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <p className="text-[11px] font-mono text-slate-400">
          Made by <span className="text-emerald-400 font-bold">GEEKS FOR GEEKS</span> • KARE
        </p>
      </div>
    </div>
  );
};

export default OperationsLandingPage;
