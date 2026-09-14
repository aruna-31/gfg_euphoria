import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Mail, ShieldCheck } from 'lucide-react';

export const EvaluatorProfilePage: React.FC = () => {
  const { user } = useAuth();
  return <div className="space-y-6 text-left max-w-3xl mx-auto">
    <div className="border-b border-[#2b3a4f] pb-5"><h1 className="text-2xl font-bold tracking-tight text-white">Evaluator Profile</h1><p className="text-xs text-slate-400 mt-1">Account details from your authorised login.</p></div>
    <Card className="p-6">
      <div className="flex items-center gap-4 pb-6 border-b border-[#2b3a4f]"><Avatar name={user?.name || 'Evaluator'} size="xl" /><div><h2 className="text-xl font-bold text-white">Evaluator Workspace</h2><p className="text-xs text-slate-400 mt-1">No profile, expertise, or assignment data has been imported.</p></div></div>
      <div className="mt-6 p-3.5 rounded-xl bg-[#111827] border border-[#2b3a4f]"><span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Authorised email</span><div className="flex items-center gap-2 text-xs text-slate-200"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>{user?.email}</span></div></div>
      <div className="mt-4 text-xs text-slate-400 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" />No evaluator assignments are currently available.</div>
    </Card>
  </div>;
};
