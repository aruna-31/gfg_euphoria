import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { StylishCursor } from '../../components/common/StylishCursor';

interface ClubPlanet {
  id: string;
  name: string;
  fullName: string;
  src: string;
  baseAngle: number;
  glow: string;
  tagColor: string;
}

export const OperationsLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [orbitAngle, setOrbitAngle] = useState(0);

  const clubs: ClubPlanet[] = [
    {
      id: 'gfg',
      name: 'GFG KARE',
      fullName: 'GeeksforGeeks Campus Body KARE',
      src: '/logos/gfg_kare_logo.png',
      baseAngle: 0,
      glow: 'shadow-[0_0_24px_rgba(34,197,94,0.7)] border-emerald-400',
      tagColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/90',
    },
    {
      id: 'ieee',
      name: 'IEEE KARE',
      fullName: 'IEEE Student Branch',
      src: '/logos/kare_ieee_logo.jpg',
      baseAngle: 72,
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.7)] border-cyan-400',
      tagColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/90',
    },
    {
      id: 'acm',
      name: 'ACM KARE',
      fullName: 'ACM Student Chapter',
      src: '/logos/kare_acm_logo.jpg',
      baseAngle: 144,
      glow: 'shadow-[0_0_24px_rgba(59,130,246,0.7)] border-blue-400',
      tagColor: 'text-blue-300 border-blue-500/40 bg-blue-950/90',
    },
    {
      id: 'acmw',
      name: 'ACM-W',
      fullName: 'ACM-W Chapter',
      src: '/logos/kare_acmw_logo.jpg',
      baseAngle: 216,
      glow: 'shadow-[0_0_24px_rgba(236,72,153,0.7)] border-pink-400',
      tagColor: 'text-pink-300 border-pink-500/40 bg-pink-950/90',
    },
    {
      id: 'gdg',
      name: 'GDG KARE',
      fullName: 'Google Developer Groups',
      src: '/logos/gdg_logo.png',
      baseAngle: 288,
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.7)] border-amber-400',
      tagColor: 'text-amber-300 border-amber-500/40 bg-amber-950/90',
    },
  ];

  // 60FPS continuous orbital rotation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      setOrbitAngle((prev) => (prev + delta * 0.024) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="min-h-screen bg-[#070D14] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden select-none cursor-default">
      <StylishCursor />
      <LoginGfgBackground />

      {/* Cosmic Starfield & Ambient Glows */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

      {/* Spacer */}
      <div className="h-4" />

      {/* Central Oval Solar System Arena */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center py-6 w-full max-w-4xl">
        {/* Orbital Stage Container */}
        <div className="relative w-full max-w-[620px] h-[360px] sm:h-[420px] flex items-center justify-center">
          {/* Oval SVG Orbit Tracks */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="-300 -180 600 360"
          >
            <defs>
              <linearGradient id="orbitGlowOps" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="orbitInnerOps" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Outer Oval Orbit */}
            <ellipse
              cx="0"
              cy="0"
              rx="250"
              ry="115"
              fill="none"
              stroke="url(#orbitGlowOps)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              className="opacity-75"
            />
            {/* Inner Accent Orbit */}
            <ellipse
              cx="0"
              cy="0"
              rx="210"
              ry="95"
              fill="none"
              stroke="url(#orbitInnerOps)"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="opacity-40"
            />
          </svg>

          {/* Central Sun / Core Star Hub */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative z-20 flex flex-col items-center justify-center text-center p-5 rounded-full bg-[#0B1520]/95 border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.4)] backdrop-blur-2xl w-44 h-44 sm:w-52 sm:h-52"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg shadow-cyan-950/60 mb-2">
              <img
                src="/logos/gfg_kare_logo.png"
                alt="GeeksforGeeks KARE"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-tight font-['Outfit',sans-serif] leading-tight">
              Hackodyssey <span className="text-cyan-400 font-mono">4.0</span>
            </h1>
            <p className="text-[9px] sm:text-[11px] font-mono text-cyan-300/90 font-bold mt-1 tracking-wider uppercase">
              Operations Directorate
            </p>
          </motion.div>

          {/* 5 Orbiting Club Planets in Oval Trajectory */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {clubs.map((club) => {
              const currentAngle = (club.baseAngle + orbitAngle) % 360;
              const rad = (currentAngle * Math.PI) / 180;

              const rx = typeof window !== 'undefined' && window.innerWidth < 640 ? 155 : 250;
              const ry = typeof window !== 'undefined' && window.innerWidth < 640 ? 75 : 115;

              const x = Math.cos(rad) * rx;
              const y = Math.sin(rad) * ry;

              const depth = (Math.sin(rad) + 1) / 2;
              const scale = 0.78 + depth * 0.42;
              const opacity = 0.55 + depth * 0.45;
              const zIndex = Math.sin(rad) >= 0 ? 30 : 10;

              return (
                <div
                  key={club.id}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  className="absolute pointer-events-auto transition-transform duration-75 ease-out"
                >
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-125 ${club.glow}`}
                    >
                      <img
                        src={club.src}
                        alt={club.name}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                    <span
                      className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border backdrop-blur-md whitespace-nowrap shadow-md transition-all duration-300 group-hover:scale-110 ${club.tagColor}`}
                    >
                      {club.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Enter Buttons & Made by GEEKS FOR GEEKS Footer */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-3 pb-6">
        <div className="grid grid-cols-2 gap-3 w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(245,158,11,0.4)' }}
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
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(6,182,212,0.4)' }}
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
