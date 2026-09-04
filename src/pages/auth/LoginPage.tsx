import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import {
  Terminal,
  UserCheck,
  Award,
  Shield,
  ArrowRight,
  Building,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'team-leader',
      title: 'Team Leader Portal',
      subtitle: 'Registered Team Representative Access',
      description:
        'Log in with your registered email to manage team roster, select problem statement, upload squad photo, and track live standings.',
      icon: <UserCheck className="w-7 h-7 text-[#00e575]" />,
      badge: 'TEAM LEADER ONLY',
      badgeVariant: 'green' as const,
      route: '/login/team-leader',
      gradient: 'from-[#00b259]/20 to-[#04331a]/10',
      border: 'border-[#00b259]/30 hover:border-[#00e575]',
      btnBg: 'bg-[#00b259] hover:bg-[#00c964] text-black',
    },
    {
      id: 'evaluator',
      title: 'Evaluator Portal',
      subtitle: 'Faculty & Expert Jury Scoring Panel',
      description:
        'Access allocated team submissions, review live prototypes against rubric criteria, submit scorecards, and provide team feedback.',
      icon: <Award className="w-7 h-7 text-amber-400" />,
      badge: 'JURY MEMBER',
      badgeVariant: 'amber' as const,
      route: '/login/evaluator',
      gradient: 'from-amber-500/10 to-amber-950/10',
      border: 'border-amber-500/30 hover:border-amber-400',
      btnBg: 'bg-amber-500 hover:bg-amber-400 text-black',
    },
    {
      id: 'admin',
      title: 'Administration Portal',
      subtitle: 'Hackathon Operations & Control Center',
      description:
        'Centralized dashboard for team imports, evaluator allocations, round management, leaderboard freeze controls, and data exports.',
      icon: <Shield className="w-7 h-7 text-purple-400" />,
      badge: 'DIRECTORATE',
      badgeVariant: 'purple' as const,
      route: '/login/admin',
      gradient: 'from-purple-500/10 to-purple-950/10',
      border: 'border-purple-500/30 hover:border-purple-400',
      btnBg: 'bg-purple-500 hover:bg-purple-400 text-black',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060807] text-gray-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden cyber-grid">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00b259]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Building className="w-4 h-4 text-[#00e575]" />
          <span>GeeksforGeeks Student Chapter • KARE</span>
        </div>
        <Badge variant="green" size="sm">
          3 PORTAL ARCHITECTURE
        </Badge>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-8">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b259] to-[#005e2e] p-0.5 shadow-2xl shadow-[#00b259]/30 mb-2">
            <div className="w-full h-full bg-[#080d0a] rounded-[14px] flex items-center justify-center text-[#00e575]">
              <Terminal className="w-8 h-8" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f1b13] border border-[#1d3524] text-[11px] font-mono text-[#00e575]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SELECT YOUR AUTHENTICATION PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            <span className="text-[#00e575]">EUPHORIA 2K26</span> PORTAL GATEWAY
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Choose your assigned role portal below to enter your workspace. Individual participant logins are disabled.
          </p>
        </div>

        {/* 3 Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`bg-gradient-to-b ${portal.gradient} bg-[#0b120e] border ${portal.border} rounded-2xl p-6 flex flex-col justify-between shadow-2xl transition-all hover:scale-[1.02] cursor-pointer group`}
              onClick={() => navigate(portal.route)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#080f0a] border border-[#142117] group-hover:border-[#00e575]/40 transition-colors">
                    {portal.icon}
                  </div>
                  <Badge variant={portal.badgeVariant} size="sm">
                    {portal.badge}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#00e575] transition-colors">
                  {portal.title}
                </h3>
                <p className="text-xs font-mono text-[#00e575] mt-0.5 mb-3">
                  {portal.subtitle}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#142117]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(portal.route);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${portal.btnBg}`}
                >
                  <span>Continue as {portal.title.replace(' Portal', '')}</span>
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
