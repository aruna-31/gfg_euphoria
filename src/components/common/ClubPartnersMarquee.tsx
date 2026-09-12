import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const CLUB_PARTNERS = [
  {
    id: 'gfg',
    name: 'GeeksforGeeks Campus Body KARE',
    shortName: 'GFG KARE',
    logo: '/logos/gfg_kare_logo.png',
    role: 'Lead Host Chapter',
    highlight: true,
    accent: 'border-[#2F8D46] bg-[#102919]/90 text-emerald-300 shadow-lg shadow-emerald-900/30',
  },
  {
    id: 'ieee',
    name: 'KARE IEEE Education Society',
    shortName: 'IEEE EdSoc',
    logo: '/logos/kare_ieee_logo.jpg',
    role: 'Technical Partner',
    highlight: false,
    accent: 'border-slate-700/60 bg-[#0F1E2E]/80 text-slate-200',
  },
  {
    id: 'acm',
    name: 'KARE ACM Student Chapter',
    shortName: 'KARE ACM',
    logo: '/logos/kare_acm_logo.jpg',
    role: 'Computing Partner',
    highlight: false,
    accent: 'border-slate-700/60 bg-[#0F1E2E]/80 text-slate-200',
  },
  {
    id: 'acmw',
    name: 'KARE ACM-W',
    shortName: 'KARE ACM-W',
    logo: '/logos/kare_acmw_logo.jpg',
    role: 'Diversity & Tech Partner',
    highlight: false,
    accent: 'border-slate-700/60 bg-[#0F1E2E]/80 text-slate-200',
  },
  {
    id: 'gdg',
    name: 'Google Developer Groups',
    shortName: 'GDG',
    logo: '/logos/gdg_logo.png',
    role: 'Innovation Partner',
    highlight: false,
    accent: 'border-slate-700/60 bg-[#0F1E2E]/80 text-slate-200',
  },
];

export const ClubPartnersMarquee: React.FC = () => {
  return (
    <section className="relative py-12 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>COLLABORATING STUDENT CHAPTERS & PARTNERS</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            ORGANIZED BY <span className="text-[#22C55E] gfg-glow-text">GFG CAMPUS BODY</span> & PARTNER CLUBS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            Hackodessey 4.0 is powered by the collaboration of 5 premier technical chapters of Kalasalingam Academy of Research and Education.
          </p>
        </div>

        {/* Highlighted Lead Club: GFG */}
        <div className="pt-2">
          <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0F2D1A] via-[#143B23] to-[#0F2D1A] border-2 border-[#22C55E] shadow-2xl shadow-emerald-950/80 flex items-center justify-between gap-4 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                <img
                  src="/logos/gfg_kare_logo.png"
                  alt="GeeksforGeeks Campus Body KARE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#22C55E] text-slate-950 font-bold">
                    LEAD HOST
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> OFFICIAL CHAPTER
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                  GeeksforGeeks Campus Body
                </h3>
                <p className="text-xs text-emerald-300 font-mono">KARE Student Chapter</p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/30">
                POWERED BY GFG
              </span>
            </div>
          </div>
        </div>

        {/* 5 Club Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-4">
          {CLUB_PARTNERS.map((club) => (
            <div
              key={club.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-between text-center group hover:-translate-y-1 ${
                club.highlight
                  ? 'bg-gradient-to-b from-[#133A22] to-[#0D2415] border-[#22C55E] ring-1 ring-emerald-500/40 shadow-xl shadow-emerald-950/50'
                  : 'bg-[#0F1E2E]/90 border-slate-700/50 hover:border-emerald-500/40 hover:bg-[#13273B]'
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shadow-md mb-3 transition-transform group-hover:scale-105">
                <img
                  src={club.logo}
                  alt={club.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  club.highlight ? 'bg-[#22C55E] text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {club.role}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {club.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
