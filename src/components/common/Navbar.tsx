import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Avatar } from '../ui/Avatar';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';

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
    navigate('/login', { replace: true });
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
        return { label: 'Team Leader', color: 'bg-pink-100 text-pink-700 border-pink-300' };
      case 'EVALUATOR':
        return { label: 'Evaluator', color: 'bg-amber-100 text-amber-700 border-amber-300' };
      case 'ADMIN':
        return { label: 'Administrator', color: 'bg-purple-100 text-purple-700 border-purple-300' };
      default:
        return { label: 'User', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#18212d]/95 backdrop-blur-md border-b border-[#2b3a4f] shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-slate-300 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <img src="/gfg-logo.svg" alt="GeeksforGeeks" className="w-16 h-10 object-contain" />
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-100">
                HACKODESSEY <span className="text-pink-400 font-mono text-xs">4.0</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Breadcrumb */}
        {breadcrumb && (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{badge.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-100 font-bold">{breadcrumb}</span>
          </div>
        )}

        {/* Right: Profile, Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#2b3a4f]">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="sm"
                className="ring-2 ring-pink-200"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-100 truncate max-w-[120px]">
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
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            title="Log out of session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
