import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { DEMO_CREDENTIALS } from '../../services/authService';
import { Badge } from '../../components/ui/Badge';
import {
  Terminal,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Key,
  Building,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const { playSuccess, playAlert } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = email.trim().toLowerCase();

    if (!clean) {
      setError("Please provide the Team Leader's registered email address.");
      playAlert();
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(clean, password);
      playSuccess();
      addToast('SUCCESS', `Authenticated as ${user.name} (${user.role})`);

      // Redirect to target or respective portal
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'EVALUATOR') {
        navigate('/evaluator/dashboard', { replace: true });
      } else {
        navigate('/team/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please verify your registered email ID.';
      setError(msg);
      playAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredential = (item: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(item.email);
    setPassword(item.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#060807] text-gray-100 flex flex-col justify-center items-center p-4 relative overflow-hidden cyber-grid">
      {/* Ambient glowing radial lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00b259]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#00e575]/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Top institution tag */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-2">
          <Building className="w-3.5 h-3.5 text-[#00b259]" />
          <span>GeeksforGeeks Student Chapter • KARE</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md my-8"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b259] to-[#005e2e] p-0.5 shadow-2xl shadow-[#00b259]/30 mb-3">
            <div className="w-full h-full bg-[#080d0a] rounded-[14px] flex items-center justify-center text-[#00e575]">
              <Terminal className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            <span className="text-[#00b259]">EUPHORIA</span> '26
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Hackathon Management & Evaluation Platform
          </p>

          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-[#0f1b13] border border-[#1d3524] text-[11px] font-mono text-[#00e575]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>TEAM LEADER REGISTERED EMAIL LOGIN</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0c130f]/90 border border-[#213527] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <div className="mb-5 text-left">
            <h2 className="text-base font-bold text-gray-100 flex items-center justify-between">
              <span>Portal Authentication</span>
              <Badge variant="green" size="sm">
                RULE 1 ENFORCED
              </Badge>
            </h2>
            <div className="p-2.5 rounded-lg bg-[#080f0a] border border-[#1a2e20] mt-2 text-[11px] text-gray-300">
              <span className="text-[#00e575] font-bold block mb-0.5 font-mono">
                Official Hackathon Regulation:
              </span>
              Login is allowed using the <strong>Team Leader’s registered email ID only</strong>. Individual team members do not have separate logins.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Team Leader's Registered Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leader.registered@email.com"
                  required
                  className="w-full bg-[#080c09] border border-[#1e2f23] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259] focus:ring-2 focus:ring-[#00b259]/30 transition-all font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block font-mono">
                Enter the exact email used during team registration
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Password / Access Pass
                </label>
                <span className="text-[10px] text-gray-500 font-mono"></span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#080c09] border border-[#1e2f23] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259] focus:ring-2 focus:ring-[#00b259]/30 transition-all font-mono"
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
              className="w-full mt-2 bg-[#00b259] hover:bg-[#00c964] text-black font-bold text-sm py-3 rounded-xl shadow-lg shadow-[#00b259]/25 hover:shadow-[#00b259]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Registered Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-[#1a2a1f]">
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2.5">
              <span className="flex items-center gap-1 font-mono font-semibold text-[#00e575]">
                <Key className="w-3.5 h-3.5" />
                REGISTERED TEST ROSTER:
              </span>
              <span>1-Click Fill</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {DEMO_CREDENTIALS.map((item: (typeof DEMO_CREDENTIALS)[number]) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => fillCredential(item)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0a100c] hover:bg-[#132017] border border-[#1b2b20] hover:border-[#00b259]/40 text-left transition-all text-xs"
                >
                  <div>
                    <p className="font-semibold text-gray-200">{item.label}</p>
                    <p className="text-[10px] font-mono text-emerald-400">{item.email}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#00e575] bg-[#00b259]/15 px-2 py-0.5 rounded border border-[#00b259]/30">
                    Use
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00b259]" />
          <span>Single-Identity Leader Access • Secure JWT Session</span>
        </div>
      </motion.div>
    </div>
  );
};
