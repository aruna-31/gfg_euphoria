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
  UserPlus,
  Cpu,
  ShieldCheck,
  Code2,
  Terminal,
  Zap,
  Globe2,
} from 'lucide-react';

export const TeamLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const partnerLogos = [
    { id: 'ieee', name: 'IEEE Education Society', src: '/logos/kare_ieee_logo.jpg' },
    { id: 'acm', name: 'ACM Student Chapter', src: '/logos/kare_acm_logo.jpg' },
    { id: 'gfg', name: 'GeeksforGeeks Campus Body KARE', src: '/logos/gfg_kare_logo.png', isLead: true },
    { id: 'acmw', name: 'ACM-W', src: '/logos/kare_acmw_logo.jpg' },
    { id: 'gdg', name: 'Google Developer Groups', src: '/logos/gdg_logo.png' },
  ];

  const tracks = [
    { name: 'AI & Intelligent Systems', desc: 'Predictive intelligence, computer vision & LLM pipelines', icon: <Cpu className="w-5 h-5 text-emerald-400" /> },
    { name: 'FinTech & Cryptography', desc: 'Fraud forensics, algorithmic systems & zero-trust security', icon: <ShieldCheck className="w-5 h-5 text-cyan-400" /> },
    { name: 'Web3 & Distributed Clouds', desc: 'Decentralized state machines & high-throughput networks', icon: <Globe2 className="w-5 h-5 text-emerald-300" /> },
    { name: 'Open Horizon Engineering', desc: 'Next-gen cross-disciplinary high-impact solutions', icon: <Zap className="w-5 h-5 text-amber-400" /> },
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
                  TEAM PORTAL
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">GeeksforGeeks Campus Body KARE</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/team/login')}
            >
              Leader Login
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
            GeeksforGeeks Campus Body KARE Presents
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
            HACKODESSEY
          </span>{' '}
          <span className="text-white">4.0</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-8"
        >
          Euphoria 2K26 Edition • The Flagship 24-Hour Innovation Marathon.
          Architect, build, and deploy breakthrough solutions.
        </motion.p>

        {/* Primary Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-2xl shadow-emerald-500/30"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/team/login')}
          >
            Enter Squad Leader Portal
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold"
            leftIcon={<UserPlus className="w-4 h-4 text-emerald-400" />}
            onClick={() => navigate('/team/register')}
          >
            Register Squad
          </Button>
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

        {/* Hackathon Challenge Tracks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
        >
          {tracks.map((tr, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0F1E2E]/90 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {tr.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                {tr.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tr.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};
export default TeamLandingPage;
