import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { Team } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  Users,
  ShieldCheck,
  Mail,
  Building,
  Crown,
  RefreshCw,
} from 'lucide-react';

export const TeamProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, [user]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const queryId = user?.teamId || user?.email || 'TEAM-001';
      let data = await teamService.getTeamById(queryId);
      
      if (!data && user?.email) {
        data = await teamService.getTeamByLeaderEmail(user.email);
      }
      
      if (!data) {
        const all = await teamService.getAllTeams();
        if (all.length > 0) {
          data = all.find((t) => t.leaderEmail.toLowerCase() === user?.email?.toLowerCase()) || all[0];
        }
      }
      setTeam(data);
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-3 font-mono">Loading team squad profile...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto bg-[#0F1E2E] border border-emerald-500/30 rounded-2xl p-8 space-y-4">
        <Users className="w-10 h-10 text-emerald-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Squad Profile Not Found</h2>
        <p className="text-xs text-slate-400">
          We could not locate your registered team squad. Please refresh or verify your login credentials.
        </p>
        <Button size="sm" variant="primary" onClick={loadTeam} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry Fetching Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0F1E2E]/90 border border-emerald-500/25 shadow-xl shadow-black/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Avatar
            src={team.photoUrl}
            name={team.name}
            size="xl"
            className="ring-4 ring-emerald-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{team.name}</h1>
              <Badge variant="gfg" size="sm">
                {team.id}
              </Badge>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <Building className="w-3.5 h-3.5 text-[#22C55E]" />
              {team.college}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Team Leader: <strong className="text-white">{team.leaderName}</strong> ({team.leaderEmail})
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 bg-[#0B1520] p-3.5 rounded-xl border border-emerald-500/20">
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Squad Status</span>
          <span className="text-base font-mono font-black text-white flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" /> {team.status.replace(/_/g, ' ')}
          </span>
          <span className="text-[11px] font-mono text-slate-400">Squad Photo: {team.photoUrl ? 'Verified' : 'Pending'}</span>
        </div>
      </div>

      {/* Team Roster Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-[#22C55E]" />
            Squad Roster ({team.members.length} Members Registered)
          </h2>
          <span className="text-[11px] font-mono text-emerald-300 font-semibold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Team Size: {team.members.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.members.map((member) => (
            <Card
              key={member.id}
              className={`p-4 flex items-start gap-3.5 transition-all ${
                member.isLeader
                  ? 'border-emerald-500/50 bg-[#0E2819]/90 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/40'
                  : 'bg-[#0F1E2E]/90 border-slate-700/60 hover:border-emerald-500/40'
              }`}
            >
              <Avatar name={member.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                  {member.isLeader && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-950 bg-[#22C55E] px-2 py-0.5 rounded">
                      <Crown className="w-3 h-3 text-slate-950" /> LEADER
                    </span>
                  )}
                </div>

                <p className="text-xs text-emerald-400 font-semibold mt-0.5">{member.roleInTeam}</p>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  {member.isLeader && member.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                      <span className="font-mono truncate text-slate-300">{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                    <span className="truncate">{member.college || team.college}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Verification Notice */}
      <Card className="bg-[#0B1520] border-emerald-500/20">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Identity & Access Protocol
            </h3>
          </div>
          <Badge variant="gfg" size="sm">ACTIVE SQUAD</Badge>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          As per Hackodessey 4.0 guidelines, individual squad members do not require separate login accounts. All challenge selections, squad photo verifications, and milestone reviews are managed through the registered Team Leader account (<strong>{team.leaderEmail}</strong>).
        </p>
      </Card>
    </div>
  );
};
