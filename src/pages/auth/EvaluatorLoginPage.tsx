import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { Award, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';

export const EvaluatorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsEvaluator } = useAuth();
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
      const user = await loginAsEvaluator(email, password);
      addToast('SUCCESS', `Welcome, Jury Member ${user.name}!`);
      navigate('/evaluator/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Check evaluator credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FA] text-[#1E1920] flex flex-col justify-between p-4 sm:p-6 lg:p-8 cyber-grid relative overflow-hidden">
      <LoginGfgBackground />
      <div className="relative z-10 max-w-md w-full mx-auto text-left my-auto">
        <div className="bg-white border border-[#F3E8FF] rounded-2xl p-6 sm:p-8 shadow-xl shadow-amber-500/5">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Evaluator Portal</h1>
                <p className="text-xs text-gray-500">Jury & Faculty Assessment Panel</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-300 text-amber-700 bg-amber-50">
              EVALUATOR
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Evaluator / Jury Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="evaluator@gfgkare.in"
                  className="w-full bg-[#FAF8FA] border border-amber-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Jury Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
                  className="w-full bg-[#FAF8FA] border border-amber-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Jury...</span>
              ) : (
                <>
                  <span>Enter Evaluator Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-amber-100 text-center">
            <button
              type="button"
              onClick={() => navigate('/login/admin')}
              className="text-xs text-amber-700 hover:underline font-semibold"
            >
              Switch to Administrator Console Login Ã¢â€ â€™
            </button>
          </div>
        </div>
      </div>

      <footer className="text-xs text-gray-500 font-mono text-center pt-4">
        Ã‚Â© 2026 Euphoria Hackathon Platform Ã¢â‚¬Â¢ Evaluator Assessment Desk
      </footer>
    </div>
  );
};
