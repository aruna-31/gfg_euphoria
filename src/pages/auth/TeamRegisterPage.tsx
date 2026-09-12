import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LoginGfgBackground } from '../../components/common/LoginGfgBackground';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/ui/Button';
import { Crown, Mail, Lock, User, Building, Phone, Users, ArrowRight, ChevronLeft, AlertTriangle } from 'lucide-react';

export const TeamRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerLeader } = useAuth();
  const { addToast } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('Kalasalingam University (KARE)');
  const [teamName, setTeamName] = useState('');

  // Additional Optional Members
  const [m2Name, setM2Name] = useState('');
  const [m2Email, setM2Email] = useState('');
  const [m2Role, setM2Role] = useState('Developer');

  const [m3Name, setM3Name] = useState('');
  const [m3Email, setM3Email] = useState('');
  const [m3Role, setM3Role] = useState('Designer');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await registerLeader({
        name,
        email,
        password,
        phone,
        college,
        team_name: teamName,
        member2_name: m2Name || undefined,
        member2_email: m2Email || undefined,
        member2_role: m2Role || undefined,
        member3_name: m3Name || undefined,
        member3_email: m3Email || undefined,
        member3_role: m3Role || undefined,
      });

      addToast('SUCCESS', `Team Registered Successfully! Welcome, Leader ${user.name}!`);
      navigate('/team/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Check details.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B131E] text-slate-100 flex flex-col justify-between relative overflow-hidden cyber-mesh">
      <LoginGfgBackground />

      <div className="relative z-10 max-w-2xl w-full mx-auto p-4 sm:p-6 text-left">
        <button
          onClick={() => navigate('/team/login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-mono transition-colors cursor-pointer mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Team Leader Login</span>
        </button>

        <div className="bg-[#0F1E2E]/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                <img
                  src="/logos/gfg_kare_logo.png"
                  alt="GeeksforGeeks Campus Body KARE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Team Leader Registration</h1>
                <p className="text-xs text-emerald-400 font-mono">Hackodessey 4.0 Official Registration</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300 bg-emerald-950/80">
              NEW SQUAD
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Team Leader Credentials */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                1. Team Leader Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Team Leader Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Email ID *
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Create Password *
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98401 23456"
                      className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Team & College Identity */}
            <div className="space-y-4 pt-3 border-t border-emerald-500/15">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                2. Team & College Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Team Name *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      placeholder="e.g. Team Matrix"
                      className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    University / College *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      required
                      placeholder="Kalasalingam University"
                      className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Additional Squad Members (Optional) */}
            <div className="space-y-4 pt-3 border-t border-emerald-500/15">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                3. Additional Squad Members (Optional)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#0B1622] rounded-xl border border-slate-700/60">
                <input
                  type="text"
                  value={m2Name}
                  onChange={(e) => setM2Name(e.target.value)}
                  placeholder="Member 2 Name"
                  className="bg-[#0F1E2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                />
                <input
                  type="email"
                  value={m2Email}
                  onChange={(e) => setM2Email(e.target.value)}
                  placeholder="Member 2 Email"
                  className="bg-[#0F1E2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                />
                <input
                  type="text"
                  value={m2Role}
                  onChange={(e) => setM2Role(e.target.value)}
                  placeholder="Role (e.g. Backend Lead)"
                  className="bg-[#0F1E2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#0B1622] rounded-xl border border-slate-700/60">
                <input
                  type="text"
                  value={m3Name}
                  onChange={(e) => setM3Name(e.target.value)}
                  placeholder="Member 3 Name"
                  className="bg-[#0F1E2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                />
                <input
                  type="email"
                  value={m3Email}
                  onChange={(e) => setM3Email(e.target.value)}
                  placeholder="Member 3 Email"
                  className="bg-[#0F1E2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
                />
                <input
                  type="text"
                  value={m3Role}
                  onChange={(e) => setM3Role(e.target.value)}
                  placeholder="Role (e.g. Frontend Lead)"
                  className="bg-[#0F1E2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
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
              className="w-full py-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Registering Squad...' : 'Complete Team Registration'}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};
