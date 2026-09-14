import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { AudioProvider } from '../context/AudioContext';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { CinematicIntro } from '../components/common/CinematicIntro';
import { TeamLeaderLoginPage } from '../pages/auth/TeamLeaderLoginPage';
import { TeamRegisterPage } from '../pages/auth/TeamRegisterPage';
import { LeaderDashboardPage } from '../pages/leader/LeaderDashboardPage';
import { ProblemSelectionPage } from '../pages/participant/ProblemSelectionPage';
import { UploadPhotoPage } from '../pages/participant/UploadPhotoPage';
import { RoundStatusPage } from '../pages/participant/RoundStatusPage';
import { LiveLeaderboardPage } from '../pages/participant/LiveLeaderboardPage';
import { TeamProfilePage } from '../pages/participant/TeamProfilePage';

const TeamHome: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={user?.role === 'LEADER' ? '/team/dashboard' : '/team/login'} replace />;
};

const TeamRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TeamHome />} />
      <Route path="/team/login" element={<TeamLeaderLoginPage />} />
      <Route path="/team/register" element={<TeamRegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/team/dashboard" element={<ProtectedRoute allowedRoles={['LEADER']}><LeaderDashboardPage /></ProtectedRoute>} />
        <Route path="/team/problem-statement" element={<ProtectedRoute allowedRoles={['LEADER']}><ProblemSelectionPage /></ProtectedRoute>} />
        <Route path="/team/photo" element={<ProtectedRoute allowedRoles={['LEADER']}><UploadPhotoPage /></ProtectedRoute>} />
        <Route path="/team/round-status" element={<ProtectedRoute allowedRoles={['LEADER']}><RoundStatusPage /></ProtectedRoute>} />
        <Route path="/team/leaderboard" element={<ProtectedRoute allowedRoles={['LEADER']}><LiveLeaderboardPage /></ProtectedRoute>} />
        <Route path="/team/profile" element={<ProtectedRoute allowedRoles={['LEADER']}><TeamProfilePage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/team/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export const TeamPortalApp: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  return <AuthProvider><NotificationProvider><AudioProvider>{showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}<TeamRoutes /></AudioProvider></NotificationProvider></AuthProvider>;
};

