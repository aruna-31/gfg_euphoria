import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Avatar } from '../ui/Avatar';
import { LogOut, Menu, X, Terminal, ChevronRight } from 'lucide-react';

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
        return { label: 'Team Leader', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'EVALUATOR':
        return { label: 'Evaluator', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'ADMIN':
        return { label: 'Administrator', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'User', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#080d0a]/95 backdrop-blur-md border-b border-[#141f17] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#131d16] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00b259] to-[#04331a] flex items-center justify-center p-0.5 shadow-md shadow-[#00b259]/20">
              <div className="w-full h-full bg-[#080d0a] rounded-[6px] flex items-center justify-center text-[#00e575]">
                <Terminal className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">
                EUPHORIA <span className="text-[#00e575] font-mono text-xs">2K26</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Breadcrumb */}
        {breadcrumb && (
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>{badge.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-200 font-semibold">{breadcrumb}</span>
          </div>
        )}

        {/* Right: Notification, Profile, Logout */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />

          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#162319]">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="sm"
                className="ring-1 ring-[#1f3325]"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-200 truncate max-w-[120px]">
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
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            title="Log out of session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
