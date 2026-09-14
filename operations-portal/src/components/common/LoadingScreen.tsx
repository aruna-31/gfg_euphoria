import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  onDismiss?: () => void;
}

const TERMINAL_STEPS = [
  'Initializing Euphoria 2026 secure enclave...',
  'Verifying registered credentials against team roster...',
  'Generating cryptographically signed JWT session...',
  'Synchronizing round-wise leaderboard metrics...',
  'Access granted. Preparing dashboard workspace...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Authenticating Credentials...',
  subMessage = 'Connecting to GFG KARE Euphoria engine',
  onDismiss,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    // Pace steps smoothly across ~3.2 seconds (~650ms per step)
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < TERMINAL_STEPS.length - 1 ? prev + 1 : prev));
    }, 620);

    // Smooth progress counter from 5% to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const increment = Math.floor(Math.random() * 4) + 3;
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050706]/95 backdrop-blur-2xl text-white select-none px-4"
    >
      {/* Background Cybernetic Glow */}
      <div className="absolute w-[550px] h-[550px] bg-[#00b259]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-[#00e575]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Holographic Spinner Enclave */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Outer Dashed Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#00b259]/50"
          />

          {/* Middle Counter-Rotating Neon Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-2 border-t-[#00e575] border-r-transparent border-b-[#00b259] border-l-transparent shadow-xl shadow-[#00b259]/30"
          />

          {/* Third Orbiting Micro-dot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute inset-[-6px] rounded-full flex items-start justify-center"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00e575] shadow-lg shadow-[#00e575]" />
          </motion.div>

          {/* Inner Pulsing Radar Core */}
          <motion.div
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b259] to-[#04331a] flex items-center justify-center p-0.5 shadow-2xl shadow-[#00b259]/50"
          >
            <div className="w-full h-full bg-[#060a08] rounded-[14px] flex items-center justify-center text-[#00e575]">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0d1c12] border border-[#1d3c26] text-[10px] font-mono text-[#00e575] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTHENTICATION PROTOCOL ACTIVE</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">{message}</h2>
          <p className="text-xs text-gray-400">{subMessage}</p>
        </motion.div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#0b130e] border border-[#1a2d20] rounded-full p-1 mb-4 shadow-inner">
          <div className="relative h-2.5 w-full bg-[#070b09] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '5%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
              className="h-full bg-gradient-to-r from-[#00b259] via-[#00e575] to-[#7effbe] rounded-full relative"
            >
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full blur-[1px]" />
            </motion.div>
          </div>
        </div>

        {/* Terminal Status Output Stream */}
        <div className="w-full bg-[#080d0a] border border-[#17261b] rounded-xl p-3.5 text-left font-mono text-[11px] shadow-lg">
          <div className="flex items-center justify-between text-gray-500 mb-2 border-b border-[#142117] pb-1.5 text-[10px]">
            <span className="flex items-center gap-1 text-gray-400">
              <Terminal className="w-3 h-3 text-[#00e575]" />
              session_auth.sh
            </span>
            <span className="text-[#00e575] font-bold text-xs">{progress}%</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 text-gray-200 min-h-[22px]"
            >
              <span className="text-[#00e575] font-bold">&gt;</span>
              <span className="truncate">{TERMINAL_STEPS[currentStepIdx]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Security Badge */}
        <div className="mt-6 flex items-center justify-between w-full text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00b259]" />
            <span>KARE Verified Channel</span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white underline text-[10px]"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
