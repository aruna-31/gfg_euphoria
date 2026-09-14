import React, { useState, useEffect } from 'react';
import { Terminal, Flame, Sparkles, Clock, BellRing, MapPin } from 'lucide-react';

export const GFGKareBanner: React.FC = () => {
  // Live countdown timer for the active hackathon round
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#050806] border-b border-[#18281d] text-xs">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-[#00b259]/15 via-[#00e575]/10 to-[#00b259]/15 border-b border-[#1b3323] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-200">
          <span className="flex items-center gap-1 font-mono font-bold text-[#00e575] bg-[#00b259]/20 px-2 py-0.5 rounded text-[10px] border border-[#00b259]/40">
            <Flame className="w-3 h-3 text-[#00e575]" />
            LIVE ANNOUNCEMENT
          </span>
          <span className="text-[11px] text-gray-300 truncate">
            Round 2 Evaluation Window is OPEN • Team Leader Registered Email Authentication Active • Prototype Demos Scheduled
          </span>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Checkpoint Cut-off:
          </span>
          <div className="flex items-center gap-1 font-bold text-[#00e575]">
            <span className="bg-[#0e1c14] px-1.5 py-0.5 rounded border border-[#1b3323]">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-[#0e1c14] px-1.5 py-0.5 rounded border border-[#1b3323]">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-[#0e1c14] px-1.5 py-0.5 rounded border border-[#1b3323]">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* GeeksforGeeks Student Chapter KARE Sub-strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between text-[11px] text-gray-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">GeeksforGeeks Student Chapter</span>
          <span className="text-gray-600">•</span>
          <span className="text-[#00e575] font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            Kalasalingam Academy of Research and Education (KARE)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] text-gray-400">
          <span className="text-gray-500">Track Domains:</span>
          <span className="text-gray-300 hover:text-[#00e575] transition-colors">AI/ML</span>
          <span>•</span>
          <span className="text-gray-300 hover:text-[#00e575] transition-colors">Web3</span>
          <span>•</span>
          <span className="text-gray-300 hover:text-[#00e575] transition-colors">FinTech</span>
          <span>•</span>
          <span className="text-gray-300 hover:text-[#00e575] transition-colors">IoT & Smart Cities</span>
          <span>•</span>
          <span className="text-gray-300 hover:text-[#00e575] transition-colors">EdTech</span>
        </div>
      </div>
    </div>
  );
};
