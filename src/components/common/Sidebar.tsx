import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileCode2,
  Image,
  Trophy,
  Clock,
  Users,
  User,
  ClipboardCheck,
  History,
  FileSpreadsheet,
  UserCheck,
  ShieldCheck,
  ListTodo,
  DownloadCloud,
  Sliders,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 1. TEAM LEADER PORTAL SIDEBAR
  const leaderLinks: SidebarLink[] = [
    { to: '/team/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/team/problem-statement', label: 'Problem Statement', icon: <FileCode2 className="w-4 h-4" /> },
    { to: '/team/photo', label: 'Team Photo', icon: <Image className="w-4 h-4" /> },
    { to: '/team/round-status', label: 'Round Status', icon: <Clock className="w-4 h-4" /> },
    { to: '/team/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { to: '/team/profile', label: 'Team Profile', icon: <Users className="w-4 h-4" /> },
  ];

  // 2. EVALUATOR PORTAL SIDEBAR
  const evaluatorLinks: SidebarLink[] = [
    { to: '/evaluator/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/evaluator/teams', label: 'Assigned Teams', icon: <ClipboardCheck className="w-4 h-4" /> },
    { to: '/evaluator/evaluate', label: 'Evaluation', icon: <FileCode2 className="w-4 h-4" /> },
    { to: '/evaluator/history', label: 'History', icon: <History className="w-4 h-4" /> },
    { to: '/evaluator/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  // 3. ADMIN PORTAL SIDEBAR
  const adminLinks: SidebarLink[] = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/admin/teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/participants', label: 'Participants', icon: <UserCheck className="w-4 h-4" /> },
    { to: '/admin/evaluators', label: 'Evaluators', icon: <ShieldCheck className="w-4 h-4" /> },
    { to: '/admin/assignments', label: 'Assignments', icon: <ListTodo className="w-4 h-4" /> },
    { to: '/admin/problems', label: 'Problem Statements', icon: <FileCode2 className="w-4 h-4" /> },
    { to: '/admin/rounds', label: 'Rounds', icon: <Clock className="w-4 h-4" /> },
    { to: '/admin/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { to: '/admin/import', label: 'CSV Import', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { to: '/admin/reports', label: 'Reports', icon: <DownloadCloud className="w-4 h-4" /> },
    { to: '/admin/settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  const currentLinks =
    role === 'LEADER'
      ? leaderLinks
      : role === 'EVALUATOR'
      ? evaluatorLinks
      : adminLinks;

  const getPortalLabel = () => {
    switch (role) {
      case 'LEADER':
        return 'Team Leader Portal';
      case 'EVALUATOR':
        return 'Evaluator Portal';
      case 'ADMIN':
        return 'Admin Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-60 bg-[#080d0a] border-r border-[#141f17] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Links */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="px-3 py-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
              {getPortalLabel()}
            </span>
          </div>

          <nav className="space-y-1">
            {currentLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#00b259] text-black font-bold shadow-md shadow-[#00b259]/15'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-[#101813]'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-[#141f17]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
