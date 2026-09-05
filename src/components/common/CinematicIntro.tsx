import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, Radio, Volume2, VolumeX, Zap } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const { isBgmPlaying, toggleBgm } = useAudio();

  useEffect(() => {
    // Hold the launch sequence for at least ten seconds so the motion and soundtrack have room to land.
    const timer1 = setTimeout(() => setPhase(2), 1200);
    const timer2 = setTimeout(() => setPhase(3), 3000);
    const timer3 = setTimeout(() => setPhase(4), 5200);
    const timer4 = setTimeout(() => setPhase(5), 7600);
    // Phase 5 -> Phase 6 (10.1s) -> Complete
    const timer5 = setTimeout(() => {
      setPhase(6);
      setTimeout(onComplete, 700);
    }, 10100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 6 ? 0 : 1, scale: phase === 6 ? 1.05 : 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#050806] text-white flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* A lightweight motion-video canvas: scanlines, telemetry, and drifting light create a cinematic opening without a heavy media download. */}
      <div className="absolute inset-0 pointer-events-none opacity-70">
        <motion.div
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-[#00e575]/10 to-transparent blur-2xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_5px] mix-blend-screen" />
        <div className="absolute left-6 top-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#65db91]">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> Live transmission / 02:26
        </div>
        <div className="absolute right-6 top-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
          <span>Signal locked</span><span className="h-1.5 w-1.5 rounded-full bg-[#00e575]" />
        </div>
        <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between gap-8 text-[9px] font-mono uppercase tracking-[0.18em] text-gray-600">
          <span>GFG / KARE / EUPHORIA</span>
          <div className="hidden sm:flex items-end gap-1 h-5">
            {[2, 4, 7, 3, 8, 5, 10, 4, 7, 3, 6, 9].map((height, index) => (
              <motion.span key={index} animate={{ height: [`${height}px`, `${height + 6}px`, `${height}px`] }} transition={{ duration: 0.7 + index * 0.03, repeat: Infinity }} className="w-1 rounded-full bg-[#00b259]/70" />
            ))}
          </div>
          <span>BOOT SEQUENCE 100%</span>
        </div>
      </div>

      {/* Background Radial Glow */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 1],
          opacity: [0.2, 0.45, 0.35],
        }}
        transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror' }}
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#00b259]/20 via-[#004d25]/10 to-transparent blur-[120px] pointer-events-none"
      />

      {/* Subtle Moving Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1911_1px,transparent_1px),linear-gradient(to_bottom,#0c1911_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Content Box */}
      <div className="relative z-10 text-center space-y-6 px-4">
        {/* Phase 2: Top Typography */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-center justify-center gap-2 font-mono text-xs tracking-[0.3em] text-[#00e575]/80 font-bold uppercase"
            >
              <span>GEEKSFORGEEKS</span>
              <span className="text-gray-600">•</span>
              <span>KARE STUDENT CHAPTER</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#21472f] bg-[#0b1b11]/80 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-gray-400 backdrop-blur-md">
          <Zap className="w-3 h-3 text-[#00e575]" /> cinematic launch sequence
        </motion.div>

        {/* Phase 3: Main Emblem Logo */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative inline-flex items-center justify-center my-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b259] to-[#04331a] p-0.5 shadow-2xl shadow-[#00b259]/40 flex items-center justify-center">
                <div className="w-full h-full bg-[#080d0a] rounded-[14px] flex items-center justify-center text-[#00e575]">
                  <Terminal className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: EUPHORIA 2K26 Wordmark */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.6em', y: 15 }}
              animate={{ opacity: 1, letterSpacing: '0.25em', y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_35px_rgba(0,229,117,0.4)]">
                EUPHORIA <span className="text-[#00e575]">2K26</span>
              </h1>

              {/* Sophisticated Glow Underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                className="w-48 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#00e575] to-transparent shadow-[0_0_15px_#00e575]"
              />

              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-2">
                National University Hackathon Platform
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 5: Three Pulsing Indicators */}
        <AnimatePresence>
          {phase >= 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-3 pt-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                    backgroundColor: ['#00b259', '#00e575', '#00b259'],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-[#00b259] shadow-sm shadow-[#00e575]"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={toggleBgm}
        className="absolute bottom-16 z-20 inline-flex items-center gap-2 rounded-full border border-[#244a31] bg-[#0b1710]/90 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.12em] text-gray-400 backdrop-blur-md transition-colors hover:border-[#00e575] hover:text-white"
        title={isBgmPlaying ? 'Pause intro soundtrack' : 'Play intro soundtrack'}
      >
        {isBgmPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#00e575]" /> : <VolumeX className="w-3.5 h-3.5" />}
        {isBgmPlaying ? 'Soundtrack live' : 'Play soundtrack'}
      </button>

      {/* Skip Option */}
      <button
        onClick={() => {
          setPhase(6);
          onComplete();
        }}
        className="absolute bottom-8 text-[11px] font-mono text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest cursor-pointer px-4 py-2 rounded-lg hover:bg-white/5"
      >
        Skip Intro ↵
      </button>
    </motion.div>
  );
};
