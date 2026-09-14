import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { LogOut, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/problem')) return 'Problem Statement';
    if (path.includes('/photo')) return 'Team Photo';
    if (path.includes('/status') || path.includes('/round-status')) return 'Round Status';
    if (path.includes('/leaderboard')) return 'Leaderboard';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/evaluate')) return 'Evaluation';
    if (path.includes('/teams')) return 'Teams';
    if (path.includes('/history')) return 'History';
    if (path.includes('/import')) return 'CSV Import';
    if (path.includes('/participants')) return 'Participants';
    if (path.includes('/evaluators')) return 'Evaluators';
    if (path.includes('/assignments')) return 'Assignments';
    if (path.includes('/rounds')) return 'Rounds';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/settings')) return 'Settings';
    return '';
  };

  const breadcrumb = getBreadcrumb();

  const getRoleBadge = () => {
    switch (role) {
      case 'LEADER':
        return { label: 'Team Leader', color: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' };
      case 'EVALUATOR':
        return { label: 'Evaluator', color: 'bg-amber-950 text-amber-300 border-amber-500/40' };
      case 'ADMIN':
        return { label: 'Administrator', color: 'bg-cyan-950 text-cyan-300 border-cyan-500/40' };
      default:
        return { label: 'User', color: 'bg-slate-800 text-slate-300 border-slate-600' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#0C1724]/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle & GFG Emblem + Hackodessey 4.0 */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shadow-emerald-950/40 shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/logos/gfg_kare_logo.png"
                alt="GeeksforGeeks Campus Body KARE"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-wide text-white">
                  HACKODESSEY <span className="text-[#22C55E] font-mono">4.0</span>
                </span>
                <span className="hidden sm:inline text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  GFG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Made by GEEKS FOR GEEKS
              </p>
            </div>
          </div>
        </div>

        {/* Center: Breadcrumb */}
        {breadcrumb && (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{badge.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400 font-bold">{breadcrumb}</span>
          </div>
        )}

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700/60">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="sm"
                className="ring-2 ring-emerald-500/40"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {user.name}
                </p>
                <span className={`inline-block text-[10px] font-mono px-1.5 py-0.2 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Log out of session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
