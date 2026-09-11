import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Shield, Award } from 'lucide-react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { AudioProvider } from '../context/AudioContext';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { CinematicIntro } from '../components/common/CinematicIntro';
import { LoginGfgBackground } from '../components/common/LoginGfgBackground';
import { EvaluatorLoginPage } from '../pages/auth/EvaluatorLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { EvaluatorDashboardPage } from '../pages/evaluator/EvaluatorDashboardPage';
import { EvaluatorTeamsPage } from '../pages/evaluator/EvaluatorTeamsPage';
import { EvaluateTeamPage } from '../pages/evaluator/EvaluateTeamPage';
import { EvaluationHistoryPage } from '../pages/evaluator/EvaluationHistoryPage';
import { EvaluatorProfilePage } from '../pages/evaluator/EvaluatorProfilePage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminTeamsPage } from '../pages/admin/AdminTeamsPage';
import { AdminParticipantsPage } from '../pages/admin/AdminParticipantsPage';
import { AdminEvaluatorsPage } from '../pages/admin/AdminEvaluatorsPage';
import { AdminAssignmentsPage } from '../pages/admin/AdminAssignmentsPage';
import { AdminProblemsPage } from '../pages/admin/AdminProblemsPage';
import { AdminRoundsPage } from '../pages/admin/AdminRoundsPage';
import { AdminLeaderboardPage } from '../pages/admin/AdminLeaderboardPage';
import { CSVImportPage } from '../pages/admin/CSVImportPage';

import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

const OperationsHome: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  const destination = user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'EVALUATOR' ? '/evaluator/dashboard' : '/login';
  return <Navigate to={destination} replace />;
};

const OperationsLogin: React.FC = () => {
  const navigate = useNavigate();
  return <main className="min-h-screen bg-[#FAF8FA] flex items-center justify-center p-6 cyber-grid relative overflow-hidden"><LoginGfgBackground /><section className="relative z-10 w-full max-w-2xl text-center"><p className="text-xs font-mono text-purple-600 mb-3">HACKODESSEY 4.0 OPERATIONS</p><h1 className="text-3xl font-black text-gray-900">Admin & Evaluator Portal</h1><p className="text-sm text-gray-600 mt-3">Use your organisation-provided account. No demo accounts are available.</p><div className="grid sm:grid-cols-2 gap-4 mt-8 text-left"><button onClick={() => navigate('/login/evaluator')} className="p-6 rounded-2xl border border-amber-200 bg-white hover:border-amber-500"><Award className="text-amber-600 mb-3" /><strong>Evaluator login</strong><span className="block text-xs text-gray-500 mt-1">Assess assigned teams and submit scores.</span></button><button onClick={() => navigate('/login/admin')} className="p-6 rounded-2xl border border-purple-200 bg-white hover:border-purple-500"><Shield className="text-purple-600 mb-3" /><strong>Administrator login</strong><span className="block text-xs text-gray-500 mt-1">Manage the hackathon and evaluator assignments.</span></button></div></section></main>;
};

const OperationsRoutes: React.FC = () => (
  <BrowserRouter><Routes>
    <Route path="/" element={<OperationsHome />} />
    <Route path="/login" element={<OperationsLogin />} />
    <Route path="/login/evaluator" element={<EvaluatorLoginPage />} />
    <Route path="/login/admin" element={<AdminLoginPage />} />
    <Route element={<AppLayout />}>
      <Route path="/evaluator/dashboard" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluatorDashboardPage /></ProtectedRoute>} />
      <Route path="/evaluator/teams" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluatorTeamsPage /></ProtectedRoute>} />
      <Route path="/evaluator/evaluate" element={<Navigate to="/evaluator/teams" replace />} />
      <Route path="/evaluator/evaluate/:teamId" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluateTeamPage /></ProtectedRoute>} />
      <Route path="/evaluator/history" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluationHistoryPage /></ProtectedRoute>} />
      <Route path="/evaluator/profile" element={<ProtectedRoute allowedRoles={['EVALUATOR']}><EvaluatorProfilePage /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/teams" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTeamsPage /></ProtectedRoute>} />
      <Route path="/admin/participants" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminParticipantsPage /></ProtectedRoute>} />
      <Route path="/admin/evaluators" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminEvaluatorsPage /></ProtectedRoute>} />
      <Route path="/admin/assignments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAssignmentsPage /></ProtectedRoute>} />
      <Route path="/admin/problems" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProblemsPage /></ProtectedRoute>} />
      <Route path="/admin/rounds" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminRoundsPage /></ProtectedRoute>} />
      <Route path="/admin/leaderboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLeaderboardPage /></ProtectedRoute>} />
      <Route path="/admin/import" element={<ProtectedRoute allowedRoles={['ADMIN']}><CSVImportPage /></ProtectedRoute>} />

      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReportsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettingsPage /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes></BrowserRouter>
);

export const OperationsPortalApp: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  return <AuthProvider><NotificationProvider><AudioProvider>{showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}<OperationsRoutes /></AudioProvider></NotificationProvider></AuthProvider>;
};


