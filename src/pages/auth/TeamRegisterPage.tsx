import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Crown, Mail, Lock, User, Building, Phone, Users, ArrowRight, ChevronLeft, AlertTriangle } from 'lucide-react';

export const TeamRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerLeader } = useAuth();
  const { addToast } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('KARE University');
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
    <div className="min-h-screen bg-[#FAF8FA] text-[#1E1920] flex flex-col justify-between p-4 sm:p-6 lg:p-8 cyber-grid">
      <div className="max-w-2xl w-full mx-auto text-left">
        <button
          onClick={() => navigate('/team/login')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-pink-600 font-mono transition-colors cursor-pointer mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Team Leader Login</span>
        </button>

        <div className="bg-white border border-[#F3E8FF] rounded-2xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-pink-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-100/60 text-[#DB2777]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Team Leader Registration</h1>
                <p className="text-xs text-gray-500">Register your hackathon team with your official email ID</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-pink-300 text-pink-700 bg-pink-50">
              NEW SQUAD
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Team & Leader Basics */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600">
                1. Team Leader Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Team Leader Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Registered Email ID *
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98401 23456"
                      className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Details */}
            <div className="space-y-4 pt-2 border-t border-pink-100">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600">
                2. Team & College Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Team Name *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      placeholder="e.g. Team Vertex"
                      className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    University / College *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      required
                      placeholder="KARE University"
                      className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Member Roster (Optional) */}
            <div className="space-y-4 pt-2 border-t border-pink-100">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600">
                3. Additional Squad Members (Optional)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                <input
                  type="text"
                  value={m2Name}
                  onChange={(e) => setM2Name(e.target.value)}
                  placeholder="Member 2 Name"
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                />
                <input
                  type="email"
                  value={m2Email}
                  onChange={(e) => setM2Email(e.target.value)}
                  placeholder="Member 2 Email"
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono"
                />
                <input
                  type="text"
                  value={m2Role}
                  onChange={(e) => setM2Role(e.target.value)}
                  placeholder="Role (e.g. Backend Lead)"
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                <input
                  type="text"
                  value={m3Name}
                  onChange={(e) => setM3Name(e.target.value)}
                  placeholder="Member 3 Name"
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                />
                <input
                  type="email"
                  value={m3Email}
                  onChange={(e) => setM3Email(e.target.value)}
                  placeholder="Member 3 Email"
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono"
                />
                <input
                  type="text"
                  value={m3Role}
                  onChange={(e) => setM3Role(e.target.value)}
                  placeholder="Role (e.g. UI/UX Engineer)"
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-900"
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Team Account...</span>
              ) : (
                <>
                  <span>Complete Team Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="text-xs text-gray-500 font-mono text-center pt-4">
        © 2026 Euphoria Hackathon Platform • Registered Team Leader Access Portal
      </footer>
    </div>
  );
};
