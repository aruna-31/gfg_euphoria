import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0B131E] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden cyber-mesh">
      <LoginGfgBackground />

      <div className="relative z-10 max-w-md w-full mx-auto text-left">
        <div className="bg-[#0F1E2E]/95 border border-emerald-500/30 rounded-2xl p-7 sm:p-9 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl">
          {/* Centered Logo & Header */}
          <div className="flex flex-col items-center justify-center text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg shadow-emerald-950/50 mb-3.5">
              <img
                src="/logos/gfg_kare_logo.png"
                alt="GeeksforGeeks Campus Body KARE"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Hackodyssey 4.0
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="leader@college.edu"
                  className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Authenticating...' : 'Enter Team Workspace'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
