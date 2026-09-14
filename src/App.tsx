import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AudioProvider } from './context/AudioContext';

// Layout & Route Guard
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CinematicIntro } from './components/common/CinematicIntro';

// Public Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { TeamLeaderLoginPage } from './pages/auth/TeamLeaderLoginPage';
import { TeamRegisterPage } from './pages/auth/TeamRegisterPage';
import { EvaluatorLoginPage } from './pages/auth/EvaluatorLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// 1. Team Leader Portal Pages
import { LeaderDashboardPage } from './pages/leader/LeaderDashboardPage';
import { ProblemSelectionPage } from './pages/participant/ProblemSelectionPage';
import { UploadPhotoPage } from './pages/participant/UploadPhotoPage';
import { LiveLeaderboardPage } from './pages/participant/LiveLeaderboardPage';
import { TeamProfilePage } from './pages/participant/TeamProfilePage';

// 2. Evaluator Portal Pages
import { EvaluatorDashboardPage } from './pages/evaluator/EvaluatorDashboardPage';
import { EvaluatorTeamsPage } from './pages/evaluator/EvaluatorTeamsPage';
import { EvaluateTeamPage } from './pages/evaluator/EvaluateTeamPage';
import { EvaluationHistoryPage } from './pages/evaluator/EvaluationHistoryPage';
import { EvaluatorProfilePage } from './pages/evaluator/EvaluatorProfilePage';

// 3. Admin Portal Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminTeamsPage } from './pages/admin/AdminTeamsPage';
import { AdminParticipantsPage } from './pages/admin/AdminParticipantsPage';
import { AdminEvaluatorsPage } from './pages/admin/AdminEvaluatorsPage';
import { AdminAssignmentsPage } from './pages/admin/AdminAssignmentsPage';
import { AdminProblemsPage } from './pages/admin/AdminProblemsPage';
import { AdminRoundsPage } from './pages/admin/AdminRoundsPage';
import { AdminLeaderboardPage } from './pages/admin/AdminLeaderboardPage';
import { CSVImportPage } from './pages/admin/CSVImportPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Root redirector based on authenticated role
const RootRedirector: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500 font-mono text-xs">
        Loading workspace permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'LEADER') return <Navigate to="/team/dashboard" replace />;
  if (role === 'EVALUATOR') return <Navigate to="/evaluator/dashboard" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function MainApp() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('gfg_intro_seen');
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('gfg_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      <BrowserRouter>
        <Routes>
          {/* Public Auth Gateway & Dedicated Login / Registration Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/team/login" element={<TeamLeaderLoginPage />} />
          <Route path="/login/team-leader" element={<TeamLeaderLoginPage />} />
          <Route path="/team/register" element={<TeamRegisterPage />} />
          <Route path="/login/evaluator" element={<EvaluatorLoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />

          {/* Main Protected Portal Shell */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<RootRedirector />} />

            {/* 1. TEAM LEADER PORTAL */}
            <Route
              path="/team/dashboard"
              element={
                <ProtectedRoute allowedRoles={['LEADER']}>
                  <LeaderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/problem-statement"
              element={
                <ProtectedRoute allowedRoles={['LEADER']}>
                  <ProblemSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/photo"
              element={
                <ProtectedRoute allowedRoles={['LEADER']}>
                  <UploadPhotoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/team/leaderboard"
              element={
                <ProtectedRoute allowedRoles={['LEADER']}>
                  <LiveLeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/profile"
              element={
                <ProtectedRoute allowedRoles={['LEADER']}>
                  <TeamProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 2. EVALUATOR PORTAL */}
            <Route
              path="/evaluator/dashboard"
              element={
                <ProtectedRoute allowedRoles={['EVALUATOR']}>
                  <EvaluatorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/teams"
              element={
                <ProtectedRoute allowedRoles={['EVALUATOR']}>
                  <EvaluatorTeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/evaluate"
              element={<Navigate to="/evaluator/teams" replace />}
            />
            <Route
              path="/evaluator/evaluate/:teamId"
              element={
                <ProtectedRoute allowedRoles={['EVALUATOR']}>
                  <EvaluateTeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/history"
              element={
                <ProtectedRoute allowedRoles={['EVALUATOR']}>
                  <EvaluationHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/profile"
              element={
                <ProtectedRoute allowedRoles={['EVALUATOR']}>
                  <EvaluatorProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 3. ADMIN PORTAL */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teams"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminTeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/participants"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminParticipantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/evaluators"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminEvaluatorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assignments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAssignmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/problems"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminProblemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rounds"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminRoundsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leaderboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/import"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CSVImportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AudioProvider>
          <MainApp />
        </AudioProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
