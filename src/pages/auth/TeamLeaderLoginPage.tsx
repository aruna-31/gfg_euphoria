import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { Crown, Mail, Lock, ArrowRight, AlertTriangle, ShieldCheck, UserPlus } from 'lucide-react';

export const TeamLeaderLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsLeader } = useAuth();
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
      const user = await loginAsLeader(email, password);
      addToast('SUCCESS', `Welcome back, Team Leader ${user.name}!`);
      navigate('/team/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Verify registered email.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FA] text-[#1E1920] flex flex-col justify-between p-4 sm:p-6 lg:p-8 cyber-grid relative overflow-hidden">
      <LoginGfgBackground />
      <div className="relative z-10 max-w-md w-full mx-auto text-left">
      {/* Login Form Card */}
        <div className="bg-white border border-[#F3E8FF] rounded-2xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-pink-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-100/60 text-[#DB2777]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Team Leader Portal</h1>
                <p className="text-xs text-gray-500">Participating Team Workspace Access</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-pink-300 text-pink-700 bg-pink-50">
              LEADER
            </span>
          </div>

          <div className="mb-5 p-3 rounded-xl bg-pink-50/70 border border-pink-200 text-xs text-pink-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <span>
              Authentication Rule: Login using your <strong>registered Team Leader email ID</strong>. Individual team members do not have separate logins.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Registered Team Leader Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="leader@college.edu"
                  className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Hackathon Password / Access Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
                  className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Enter Team Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-5 pt-4 border-t border-pink-100 text-center">
            <button
              type="button"
              onClick={() => navigate('/team/register')}
              className="inline-flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-700 font-bold hover:underline cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Team Leader? Register Your Squad Here</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="text-xs text-gray-500 font-mono text-center pt-4">
        Ã‚Â© 2026 Euphoria Hackathon Platform Ã¢â‚¬Â¢ Registered Team Leader Access Portal
      </footer>
    </div>
  );
};
