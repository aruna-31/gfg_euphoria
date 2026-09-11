import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { Shield, Mail, Lock, ArrowRight, ChevronLeft, AlertTriangle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await loginAsAdmin(email, password);
      addToast('SUCCESS', `Welcome, Administrator ${user.name}!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Unauthorized admin credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FA] text-[#1E1920] flex flex-col justify-between p-4 sm:p-6 lg:p-8 cyber-grid relative overflow-hidden">
      <LoginGfgBackground />
      <div className="relative z-10 max-w-md w-full mx-auto text-left">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 font-mono transition-colors cursor-pointer mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Portal Selection</span>
        </button>

        <div className="bg-white border border-[#F3E8FF] rounded-2xl p-6 sm:p-8 shadow-xl shadow-purple-500/5">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration</h1>
                <p className="text-xs text-gray-500">Hackathon Directorate Console</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-300 text-purple-700 bg-purple-50">
              ADMIN
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@gfgkare.in"
                  className="w-full bg-[#FAF8FA] border border-purple-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
                  className="w-full bg-[#FAF8FA] border border-purple-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <span>Enter Administration Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      <footer className="text-xs text-gray-500 font-mono text-center pt-4">
        Ã‚Â© 2026 Euphoria Hackathon Platform Ã¢â‚¬Â¢ Centralized Operations Control
      </footer>
    </div>
  );
};
