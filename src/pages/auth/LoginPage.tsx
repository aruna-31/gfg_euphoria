import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ClubPartnersMarquee } from '../../components/common/ClubPartnersMarquee';
import { Footer } from '../../components/common/Footer';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import {
  UserCheck,
  Award,
  Shield,
  ArrowRight,
  Sparkles,
  UserPlus,
  Cpu,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'team-leader',
      title: 'Team Leader Workspace',
      subtitle: 'Official Participating Squads',
      description:
        'Log in with your registered Team Leader email ID to lock your challenge statement, upload your team squad photo, and manage your squad roster.',
      icon: <UserCheck className="w-6 h-6 text-[#22C55E]" />,
      badge: 'PARTICIPANTS',
      badgeVariant: 'gfg' as const,
      route: '/team/login',
      ctaText: 'Enter Team Portal',
      highlight: true,
    },
    {
      id: 'evaluator',
      title: 'Jury & Evaluator Panel',
      subtitle: 'Expert Review & Scoring',
      description:
        'Access assigned team submissions, review prototypes against official criteria rubric, and submit live round scorecards.',
      icon: <Award className="w-6 h-6 text-amber-400" />,
      badge: 'JURY PANEL',
      badgeVariant: 'amber' as const,
      route: '/login/evaluator',
      ctaText: 'Enter Evaluator Portal',
      highlight: false,
    },
    {
      id: 'admin',
      title: 'Operations & Control',
      subtitle: 'Hackathon Management Directorate',
      description:
        'Centralized dashboard for team imports, evaluator allocations, round management, leaderboard freeze controls, and marksheet exports.',
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      badge: 'ADMIN',
      badgeVariant: 'cyan' as const,
      route: '/login/admin',
      ctaText: 'Enter Admin Portal',
      highlight: false,
    },
  ];

  const stats = [
    { label: 'Event Edition', value: '4.0', icon: <Flame className="w-4 h-4 text-[#22C55E]" /> },
    { label: 'Official Tracks', value: '17 Challenges', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
    { label: 'Team Capacity', value: 'Max 3 / Problem', icon: <Lock className="w-4 h-4 text-amber-400" /> },
    { label: 'Platform Status', value: 'Live & Synchronized', icon: <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> },
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
                  GFG HOSTED
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">GeeksforGeeks Campus Body KARE</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/team/register')}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Register Squad
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/team/login')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Leader Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 py-10 space-y-12">
        {/* Main Banner */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-lg shadow-emerald-950/50"
          >
            <Sparkles className="w-4 h-4 text-[#22C55E]" />
            <span>NATIONAL FLAGSHIP HACKATHON • 2026 EDITION</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight uppercase font-['Outfit',sans-serif]"
          >
            HACKODESSEY <span className="text-[#22C55E] gfg-glow-text">4.0</span>
          </motion.h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to the official portal of <strong className="text-white">Hackodessey 4.0</strong>, powered by <strong className="text-[#22C55E]">GeeksforGeeks Campus Body KARE</strong>. Select your portal to proceed to your workspace.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {stats.map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#0F1E2E]/80 border border-emerald-500/20 backdrop-blur-md flex items-center gap-3 text-left"
              >
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30">
                  {st.icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">{st.label}</p>
                  <p className="text-xs sm:text-sm font-extrabold text-white">{st.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Portal Gateway Cards */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">
              Select Your Gateway
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your role to access your dedicated workspace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {portals.map((portal, idx) => (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                onClick={() => navigate(portal.route)}
                className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 ${
                  portal.highlight
                    ? 'bg-gradient-to-b from-[#132E20] via-[#0E2218] to-[#0A1710] border-[#22C55E]/60 ring-1 ring-emerald-500/40 shadow-2xl shadow-emerald-950/80'
                    : 'bg-[#0F1E2E]/90 border-slate-700/60 hover:border-emerald-500/40 hover:bg-[#13273B] shadow-xl shadow-black/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 shadow-md">
                      {portal.icon}
                    </div>
                    <Badge variant={portal.badgeVariant} size="sm">
                      {portal.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#22C55E] transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 mt-0.5 mb-3 font-semibold">
                    {portal.subtitle}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-500/15">
                  <Button
                    variant={portal.highlight ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(portal.route);
                    }}
                  >
                    {portal.ctaText}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5 Club Partners Showcase */}
        <ClubPartnersMarquee />
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};
