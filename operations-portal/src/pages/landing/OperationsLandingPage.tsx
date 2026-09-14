import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/common/Footer';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Award,
  Lock,
  Layers,
  BarChart3,
  FileCheck2,
} from 'lucide-react';

export const OperationsLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const partnerLogos = [
    { id: 'ieee', name: 'IEEE Education Society', src: '/logos/kare_ieee_logo.jpg' },
    { id: 'acm', name: 'ACM Student Chapter', src: '/logos/kare_acm_logo.jpg' },
    { id: 'gfg', name: 'GeeksforGeeks Campus Body KARE', src: '/logos/gfg_kare_logo.png', isLead: true },
    { id: 'acmw', name: 'ACM-W', src: '/logos/kare_acmw_logo.jpg' },
    { id: 'gdg', name: 'Google Developer Groups', src: '/logos/gdg_logo.png' },
  ];

  const capabilities = [
    { name: 'Standardized Jury Rubrics', desc: 'Multi-criteria weighted evaluation and automated tallying', icon: <Award className="w-5 h-5 text-amber-400" /> },
    { name: '3-Team Capacity Locking', desc: 'Real-time database limits with automatic track closing', icon: <Lock className="w-5 h-5 text-emerald-400" /> },
    { name: 'Live Directorate Pulse', desc: 'Team photo audits, leaderboards, and scoring status', icon: <BarChart3 className="w-5 h-5 text-cyan-400" /> },
    { name: 'Tamper-Resistant Audits', desc: 'PostgreSQL-backed score validation and marksheet exports', icon: <FileCheck2 className="w-5 h-5 text-emerald-300" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B131E] text-slate-100 flex flex-col justify-between relative overflow-hidden cyber-mesh">
      <LoginGfgBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full border-b border-emerald-500/20 bg-[#0C1724]/80 backdrop-blur-xl py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
              <img
                src="/logos/gfg_kare_logo.png"
                alt="GeeksforGeeks Campus Body KARE"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-wide">HACKODESSEY 4.0</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  OPERATIONS CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">GeeksforGeeks Campus Body KARE</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login/evaluator')}
            >
              Evaluator Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login/admin')}
            >
              Admin Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Landing Showcase */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 text-center">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F1E2E]/90 border border-emerald-500/35 shadow-xl shadow-emerald-950/50 mb-6 backdrop-blur-xl"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-widest">
            Hackathon Directorate & Jury Portal
          </span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </motion.div>

        {/* Lead Hero GFG Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-block p-4 sm:p-5 rounded-3xl bg-[#0F1E2E]/95 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950 backdrop-blur-2xl mb-8"
        >
          <img
            src="/logos/gfg_kare_logo.png"
            alt="GeeksforGeeks Campus Body KARE"
            className="w-52 sm:w-64 h-24 object-contain mx-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none mb-4 font-['Outfit',sans-serif]"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent">
            OPERATIONS & JURY
          </span>{' '}
          <span className="text-white">COMMAND</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          Centralized governance, live problem statement allocation monitoring, and jury scoring console for Hackodessey 4.0.
        </motion.p>

        {/* Portal Gateway Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16 text-left"
        >
          {/* Evaluator Card */}
          <div
            onClick={() => navigate('/login/evaluator')}
            className="p-6 rounded-2xl bg-[#0F1E2E]/90 border border-amber-500/30 hover:border-amber-500/60 hover:bg-[#132538] transition-all duration-300 shadow-2xl backdrop-blur-xl group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Evaluator Portal
                </h2>
                <Badge variant="amber" size="sm">JURY</Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review assigned team prototypes, score criteria rubrics, and provide official feedback.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-500/15 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Enter Evaluator Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => navigate('/login/admin')}
            className="p-6 rounded-2xl bg-[#0F1E2E]/90 border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-[#132538] transition-all duration-300 shadow-2xl backdrop-blur-xl group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Admin Portal
                </h2>
                <Badge variant="cyan" size="sm">DIRECTORATE</Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage hackathon rounds, track live 3-team capacity slots, inspect squad rosters, and export marks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>Enter Admin Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* 5 Collaborating Chapters Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto mb-16 p-6 rounded-2xl bg-[#0F1E2E]/80 border border-emerald-500/20 shadow-2xl backdrop-blur-xl"
        >
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-5">
            Organized in Collaboration With
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center justify-center">
            {partnerLogos.map((p) => (
              <div
                key={p.id}
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                  p.isLead
                    ? 'bg-white border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
                    : 'bg-white/95 border border-slate-700/60 hover:border-emerald-500/40 hover:scale-105'
                }`}
              >
                <div className="w-16 h-12 flex items-center justify-center">
                  <img src={p.src} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-1">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Operations Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
        >
          {capabilities.map((c, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0F1E2E]/90 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};
export default OperationsLandingPage;
