import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import {
  UserCheck,
  Award,
  Shield,
  ArrowRight,
  Building,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'team-leader',
      title: 'Team Leader Portal',
      subtitle: 'Participating Team Representative Access',
      description:
        'Log in or register your squad with your official email ID to manage roster, select problem statement, upload squad photo, and track live standings.',
      icon: <UserCheck className="w-7 h-7 text-[#DB2777]" />,
      badge: 'PARTICIPANTS',
      badgeVariant: 'green' as const,
      route: '/team/login',
      gradient: 'from-pink-100/50 to-rose-50/50',
      border: 'border-pink-200 hover:border-pink-500',
      btnBg: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white',
    },
    {
      id: 'evaluator',
      title: 'Evaluator Portal',
      subtitle: 'Faculty & Expert Jury Scoring Panel',
      description:
        'Access allocated team submissions, review live prototypes against rubric criteria, submit scorecards, and provide team feedback.',
      icon: <Award className="w-7 h-7 text-amber-600" />,
      badge: 'JURY PANEL',
      badgeVariant: 'amber' as const,
      route: '/login/evaluator',
      gradient: 'from-amber-100/40 to-yellow-50/40',
      border: 'border-amber-200 hover:border-amber-500',
      btnBg: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    {
      id: 'admin',
      title: 'Administration Portal',
      subtitle: 'Hackathon Operations & Control Center',
      description:
        'Centralized dashboard for team imports, evaluator allocations, round management, leaderboard freeze controls, and data exports.',
      icon: <Shield className="w-7 h-7 text-purple-600" />,
      badge: 'DIRECTORATE',
      badgeVariant: 'purple' as const,
      route: '/login/admin',
      gradient: 'from-purple-100/40 to-indigo-50/40',
      border: 'border-purple-200 hover:border-purple-500',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FA] text-[#1E1920] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden cyber-grid">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-300/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Official GFG Green Emblem */}
          <div className="w-9 h-9 rounded-xl bg-[#2F8D46] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
            gfg
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-gray-900 block leading-none">GeeksforGeeks Student Chapter</span>
            <span className="text-[10px] text-gray-500 font-mono">Kalasalingam Academy of Research and Education</span>
          </div>
        </div>

        <Badge variant="green" size="sm">
          POSTGRESQL & FASTAPI BACKEND
        </Badge>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-8">
        <div className="text-center mb-10 space-y-3">
          {/* GFG Euphoria Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-mono text-[#DB2777]">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>NATIONAL HACKATHON PLATFORM • LIGHT BABY PINK EDITION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900">
            <span className="text-[#2F8D46]">GFG</span> <span className="text-[#DB2777]">EUPHORIA '26</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Select your portal to enter your workspace. Individual participant logins are disabled; team leaders authenticate with their registered email ID.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/team/register')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition-all shadow-md shadow-pink-500/20 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Team Squad</span>
            </button>
          </div>
        </div>

        {/* 3 Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`bg-gradient-to-b ${portal.gradient} bg-white border ${portal.border} rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-pink-500/5 transition-all hover:scale-[1.02] cursor-pointer group`}
              onClick={() => navigate(portal.route)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white border border-pink-100 shadow-sm group-hover:border-pink-300 transition-colors">
                    {portal.icon}
                  </div>
                  <Badge variant={portal.badgeVariant} size="sm">
                    {portal.badge}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {portal.title}
                </h3>
                <p className="text-xs font-mono text-pink-600 mt-0.5 mb-3">
                  {portal.subtitle}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(portal.route);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${portal.btnBg}`}
                >
                  <span>Enter {portal.title.replace(' Portal', '')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-xs text-gray-500 font-mono text-center">
        © 2026 GeeksforGeeks Student Chapter • Kalasalingam Academy of Research and Education (KARE)
      </footer>
    </div>
  );
};
