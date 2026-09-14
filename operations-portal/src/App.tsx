import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AudioProvider } from './context/AudioContext';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CinematicIntro } from './components/common/CinematicIntro';
import { OperationsLandingPage } from './pages/landing/OperationsLandingPage';
import { EvaluatorLoginPage } from './pages/auth/EvaluatorLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { EvaluatorDashboardPage } from './pages/evaluator/EvaluatorDashboardPage';
import { EvaluatorTeamsPage } from './pages/evaluator/EvaluatorTeamsPage';
import { EvaluateTeamPage } from './pages/evaluator/EvaluateTeamPage';
import { EvaluationHistoryPage } from './pages/evaluator/EvaluationHistoryPage';
import { EvaluatorProfilePage } from './pages/evaluator/EvaluatorProfilePage';
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

const OperationsRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Cinematic Showcase Landing Page */}
      <Route path="/" element={<OperationsLandingPage />} />
      <Route path="/login" element={<OperationsLandingPage />} />

      {/* Dedicated Authentication Gateways */}
      <Route path="/login/evaluator" element={<EvaluatorLoginPage />} />
      <Route path="/evaluator/login" element={<EvaluatorLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Operations Workspaces */}
      <Route element={<AppLayout />}>
        {/* Evaluator Routes */}
        <Route path="/evaluator/dashboard" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluatorDashboardPage /></ProtectedRoute>} />
        <Route path="/evaluator/teams" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluatorTeamsPage /></ProtectedRoute>} />
        <Route path="/evaluator/evaluate" element={<Navigate to="/evaluator/teams" replace />} />
        <Route path="/evaluator/evaluate/:teamId" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluateTeamPage /></ProtectedRoute>} />
        <Route path="/evaluator/history" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluationHistoryPage /></ProtectedRoute>} />
        <Route path="/evaluator/profile" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluatorProfilePage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/problems" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProblemsPage /></ProtectedRoute>} />
        <Route path="/admin/teams" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTeamsPage /></ProtectedRoute>} />
        <Route path="/admin/participants" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminParticipantsPage /></ProtectedRoute>} />
        <Route path="/admin/evaluators" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminEvaluatorsPage /></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAssignmentsPage /></ProtectedRoute>} />
        <Route path="/admin/rounds" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminRoundsPage /></ProtectedRoute>} />
        <Route path="/admin/leaderboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLeaderboardPage /></ProtectedRoute>} />
        <Route path="/admin/import" element={<ProtectedRoute allowedRoles={['ADMIN']}><CSVImportPage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReportsPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettingsPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AudioProvider>
          <OperationsRoutes />
        </AudioProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
