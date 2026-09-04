import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Award, Mail, Lock, ArrowRight, ChevronLeft, AlertTriangle } from 'lucide-react';

export const EvaluatorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsEvaluator } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('evaulator1@gmial.com');
  const [password, setPassword] = useState('jury123');
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
    <div className="min-h-screen bg-[#070a08] text-gray-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full mx-auto text-left">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono transition-colors cursor-pointer mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Portal Selection</span>
        </button>

        <div className="bg-[#0b120e] border border-[#1b2b20] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#142117]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#1c1811] border border-[#2e261c] text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Evaluator Portal</h1>
                <p className="text-xs text-gray-400">Jury & Faculty Assessment Panel</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10">
              EVALUATOR
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Evaluator / Jury Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="evaluator@gfgkare.in"
                  className="w-full bg-[#070a08] border border-[#18261d] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Jury Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#070a08] border border-[#18261d] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
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

          <div className="mt-6 pt-4 border-t border-[#142117] text-[11px] font-mono text-gray-400 space-y-1.5">
            <span className="text-amber-400 font-semibold block">Demo Jury Account:</span>
            <button
              type="button"
              onClick={() => setEmail('raman@gfgkare.in')}
              className="px-2.5 py-1 rounded bg-[#070a08] border border-[#142117] hover:border-amber-400 text-gray-300 hover:text-white cursor-pointer"
            >
              raman@gfgkare.in (Dr. Sundararajan Raman)
            </button>
          </div>
        </div>
      </div>

      <footer className="text-xs text-gray-500 font-mono text-center pt-4">
        © 2026 Euphoria Hackathon Platform • Evaluator Assessment Desk
      </footer>
    </div>
  );
};
