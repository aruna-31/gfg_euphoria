import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AudioProvider } from './context/AudioContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CinematicIntro } from './components/common/CinematicIntro';
import { TeamLandingPage } from './pages/landing/TeamLandingPage';
import { TeamLeaderLoginPage } from './pages/auth/TeamLeaderLoginPage';
import { TeamRegisterPage } from './pages/auth/TeamRegisterPage';
import { LeaderDashboardPage } from './pages/leader/LeaderDashboardPage';
import { ProblemSelectionPage } from './pages/participant/ProblemSelectionPage';
import { UploadPhotoPage } from './pages/participant/UploadPhotoPage';
import { LiveLeaderboardPage } from './pages/participant/LiveLeaderboardPage';
import { TeamProfilePage } from './pages/participant/TeamProfilePage';

const TeamRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Cinematic Showcase Landing Page */}
      <Route path="/" element={<TeamLandingPage />} />

      {/* Dedicated Authentication Gateways */}
      <Route path="/team/login" element={<TeamLeaderLoginPage />} />
      <Route path="/login" element={<TeamLeaderLoginPage />} />
      <Route path="/team/register" element={<TeamRegisterPage />} />
      <Route path="/register" element={<TeamRegisterPage />} />

      {/* Protected Squad Workspaces */}
      <Route element={<AppLayout />}>
        <Route path="/team/dashboard" element={<ProtectedRoute allowedRoles={['LEADER']}><LeaderDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['LEADER']}><LeaderDashboardPage /></ProtectedRoute>} />
        <Route path="/team/problem-statement" element={<ProtectedRoute allowedRoles={['LEADER']}><ProblemSelectionPage /></ProtectedRoute>} />
        <Route path="/problem-statement" element={<ProtectedRoute allowedRoles={['LEADER']}><ProblemSelectionPage /></ProtectedRoute>} />
        <Route path="/team/photo" element={<ProtectedRoute allowedRoles={['LEADER']}><UploadPhotoPage /></ProtectedRoute>} />
        <Route path="/photo" element={<ProtectedRoute allowedRoles={['LEADER']}><UploadPhotoPage /></ProtectedRoute>} />
        <Route path="/team/leaderboard" element={<ProtectedRoute allowedRoles={['LEADER']}><LiveLeaderboardPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['LEADER']}><LiveLeaderboardPage /></ProtectedRoute>} />
        <Route path="/team/profile" element={<ProtectedRoute allowedRoles={['LEADER']}><TeamProfilePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['LEADER']}><TeamProfilePage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <AuthProvider>
      <NotificationProvider>
        <AudioProvider>
          {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}
          <TeamRoutes />
        </AudioProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
