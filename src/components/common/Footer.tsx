import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-emerald-500/20 bg-[#0A111A]/95 backdrop-blur-xl py-6 px-4 text-center mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Event & GFG Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
            <img
              src="/logos/gfg_kare_logo.png"
              alt="GeeksforGeeks Campus Body KARE"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-extrabold text-white tracking-wide">
              Hackodessey 4.0
            </p>
            <p className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#22C55E]" /> Made by GEEKS FOR GEEKS
            </p>
          </div>
        </div>

        {/* Right: Copyright & Chapters */}
        <div className="text-xs text-slate-400 font-mono text-center md:text-right space-y-0.5">
          <p>© 2026 Hackodessey 4.0 • All Rights Reserved</p>
          <p className="text-[11px] text-slate-500 flex items-center justify-center md:justify-end gap-1">
            Organized with <Heart className="w-3 h-3 text-emerald-400 inline fill-emerald-400" /> by GFG KARE, IEEE, ACM, ACM-W & GDG
          </p>
        </div>
      </div>
    </footer>
  );
};
