import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Shield, Mail, Lock, ArrowRight, ChevronLeft, AlertTriangle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('admin@gfgkare.in');
  const [password, setPassword] = useState('admin123');
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
              <div className="p-3 rounded-xl bg-[#17111c] border border-[#271c2e] text-purple-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Administration</h1>
                <p className="text-xs text-gray-400">Hackathon Directorate Console</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-500/40 text-purple-400 bg-purple-500/10">
              ADMIN
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@gfgkare.in"
                  className="w-full bg-[#070a08] border border-[#18261d] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#070a08] border border-[#18261d] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20 disabled:opacity-50"
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

          <div className="mt-6 pt-4 border-t border-[#142117] text-[11px] font-mono text-gray-400 space-y-1.5">
            <span className="text-purple-400 font-semibold block">Demo Admin Account:</span>
            <button
              type="button"
              onClick={() => setEmail('admin@gfgkare.in')}
              className="px-2.5 py-1 rounded bg-[#070a08] border border-[#142117] hover:border-purple-400 text-gray-300 hover:text-white cursor-pointer"
            >
              admin@gfgkare.in (Operations Directorate)
            </button>
          </div>
        </div>
      </div>

      <footer className="text-xs text-gray-500 font-mono text-center pt-4">
        © 2026 Euphoria Hackathon Platform • Centralized Operations Control
      </footer>
    </div>
  );
};
