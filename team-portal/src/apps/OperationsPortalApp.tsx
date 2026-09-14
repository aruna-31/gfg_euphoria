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
import { Footer } from '../components/common/Footer';

const OperationsHome: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  const destination = user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'EVALUATOR' ? '/evaluator/dashboard' : '/login';
  return <Navigate to={destination} replace />;
};

const OperationsLogin: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-[#0A111A] text-slate-100 flex flex-col justify-between p-6 cyber-grid relative overflow-hidden">
      <LoginGfgBackground />
      <div className="my-auto relative z-10 w-full max-w-2xl mx-auto text-center py-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1E2E] border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-4 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          HACKODESSEY 4.0 OPERATIONS
        </div>
        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent">
          Admin & Evaluator Portal
        </h1>
        <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">
          Authorized console for jury evaluation and hackathon governance. Powered by GeeksforGeeks.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8 text-left">
          <button
            onClick={() => navigate('/login/evaluator')}
            className="p-6 rounded-2xl border border-emerald-500/20 bg-[#0F1E2E]/80 hover:bg-[#132538] hover:border-emerald-500/50 transition-all duration-300 shadow-xl backdrop-blur-xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <strong className="block text-slate-100 text-base group-hover:text-emerald-300 transition-colors">Evaluator Login</strong>
            <span className="block text-xs text-slate-400 mt-1">
              Assess assigned squads, review problem statements, and submit scores.
            </span>
          </button>

          <button
            onClick={() => navigate('/login/admin')}
            className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0F1E2E]/80 hover:bg-[#132538] hover:border-cyan-500/50 transition-all duration-300 shadow-xl backdrop-blur-xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <strong className="block text-slate-100 text-base group-hover:text-cyan-300 transition-colors">Administrator Login</strong>
            <span className="block text-xs text-slate-400 mt-1">
              Manage hackathon rounds, capacity locks, teams, and live metrics.
            </span>
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
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


