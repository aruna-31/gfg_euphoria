import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Crown, Mail, Lock, ArrowRight, ChevronLeft, AlertTriangle, ShieldCheck, Radio, Timer, Users } from 'lucide-react';

export const TeamLeaderLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsLeader } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('aarav.sharma@iitm.ac.in');
  const [password, setPassword] = useState('leader123');
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
    <div className="min-h-screen bg-[#070a08] text-gray-100 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_25%_0%,rgba(0,229,117,0.16),transparent_62%)] pointer-events-none" />

      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono transition-colors cursor-pointer mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Portal Selection</span>
        </button>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e575] animate-live-dot" />
            Euphoria 2K26 / Secure Access
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] gap-10 lg:gap-20 items-center max-w-6xl mx-auto">
          <section className="hidden lg:block text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1d5735] bg-[#0d2417] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#6affae]">
              <Radio className="w-3.5 h-3.5" /> Live team gateway
            </div>
            <p className="mt-7 text-sm font-mono uppercase tracking-[0.28em] text-[#00e575]">GeeksforGeeks · KARE</p>
            <h1 className="mt-3 max-w-xl text-6xl font-black leading-[0.94] tracking-[-0.04em] text-white">
              Build loud.<br /><span className="text-[#00e575]">Ship bright.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
              Your team workspace for challenge selection, squad verification, round checkpoints, and the live Euphoria standings.
            </p>
            <div className="mt-12 grid max-w-lg grid-cols-3 border-y border-[#1a3022] py-4">
              <div className="border-r border-[#1a3022]"><Timer className="w-4 h-4 text-[#00e575] mb-2" /><strong className="block text-lg text-white">24H</strong><span className="text-[10px] font-mono uppercase text-gray-500">Build window</span></div>
              <div className="px-5 border-r border-[#1a3022]"><Users className="w-4 h-4 text-[#00e575] mb-2" /><strong className="block text-lg text-white">08</strong><span className="text-[10px] font-mono uppercase text-gray-500">Teams live</span></div>
              <div className="pl-5"><Radio className="w-4 h-4 text-[#00e575] mb-2" /><strong className="block text-lg text-white">LIVE</strong><span className="text-[10px] font-mono uppercase text-gray-500">Round 02</span></div>
            </div>
          </section>

          <div className="w-full max-w-md mx-auto lg:mx-0 text-left">
          <div className="bg-[#0b120e]/95 border border-[#24432e] rounded-2xl p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-[#142117]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#111c15] border border-[#1c2e22] text-[#00e575]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Team Leader Portal</h1>
                <p className="text-xs text-gray-400">Team Workspace Authentication</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
              LEADER
            </span>
          </div>

          <div className="mb-5 p-3 rounded-xl bg-[#07120a] border border-[#14261a] text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00e575] shrink-0 mt-0.5" />
            <span>
              Authentication Rule: Login using your <strong>registered Team Leader email ID</strong>. Individual team members do not have separate logins.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Registered Team Leader Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="leader@college.edu"
                  className="w-full bg-[#070a08] border border-[#18261d] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00b259] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Hackathon Password / Access Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#070a08] border border-[#18261d] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00b259] font-mono"
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#00b259] hover:bg-[#00c964] text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00b259]/20 disabled:opacity-50"
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

          {/* Preset Demo Hints */}
          <div className="mt-6 pt-4 border-t border-[#142117] text-[11px] font-mono text-gray-400 space-y-1.5">
            <span className="text-[#00e575] font-semibold block">Demo Team Leader Accounts:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEmail('aarav.sharma@iitm.ac.in')}
                className="px-2.5 py-1 rounded bg-[#070a08] border border-[#142117] hover:border-[#00b259] text-gray-300 hover:text-white cursor-pointer"
              >
                aarav.sharma@iitm.ac.in (Team Vertex)
              </button>
              <button
                type="button"
                onClick={() => setEmail('karthik.s@klu.ac.in')}
                className="px-2.5 py-1 rounded bg-[#070a08] border border-[#142117] hover:border-[#00b259] text-gray-300 hover:text-white cursor-pointer"
              >
                karthik.s@klu.ac.in (Team Nova)
              </button>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-xs text-gray-500 font-mono text-center px-5 pb-5">
        © 2026 Euphoria Hackathon Platform • Registered Team Leader Access Only
      </footer>
    </div>
  );
};
