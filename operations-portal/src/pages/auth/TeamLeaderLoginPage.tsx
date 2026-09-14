import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/ui/Button';
import { Crown, Mail, Lock, ArrowRight, AlertTriangle, ShieldCheck, UserPlus, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0B131E] text-slate-100 flex flex-col justify-between relative overflow-hidden cyber-mesh">
      <LoginGfgBackground />

      {/* Top Bar */}
      <div className="relative z-10 p-4 sm:p-6 max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gateways</span>
        </button>

        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
          Hackodessey 4.0
        </span>
      </div>

      {/* Form Container */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 py-4 text-left">
        <div className="bg-[#0F1E2E]/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shadow-emerald-950/40 shrink-0">
                <img
                  src="/logos/gfg_kare_logo.png"
                  alt="GeeksforGeeks Campus Body KARE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Team Leader Portal</h1>
                <p className="text-xs text-emerald-400 font-mono">Participating Squad Access</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300 bg-emerald-950/80">
              LEADER
            </span>
          </div>

          <div className="mb-5 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
            <span>
              Authentication Rule: Login with your <strong>registered Team Leader email ID</strong>. Individual squad members do not have separate accounts.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Registered Team Leader Email ID
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
                Hackathon Password / Access Token
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

          {/* Registration Link */}
          <div className="mt-5 pt-4 border-t border-emerald-500/15 text-center">
            <button
              type="button"
              onClick={() => navigate('/team/register')}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Team Leader? Register Your Squad Here</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
