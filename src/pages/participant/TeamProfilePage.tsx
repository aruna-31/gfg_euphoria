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
  Phone,
  Building,
  Crown,
  Sparkles,
  Award,
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
      const data = await teamService.getTeamById(user?.teamId || 'TEAM-001');
      setTeam(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !team) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1611] via-[#101b14] to-[#0a100d] border border-[#213527] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Avatar
            src={team.photoUrl}
            name={team.name}
            size="xl"
            className="ring-3 ring-[#00b259]/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{team.name}</h1>
              <Badge variant="green" size="sm">
                {team.id}
              </Badge>
            </div>
            <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
              <Building className="w-3.5 h-3.5 text-gray-500" />
              {team.college}
            </p>
            <p className="text-[11px] font-mono text-gray-500 mt-1">
              Registered on: {new Date(team.createdAt).toLocaleDateString()} • Team Leader: {team.leaderName}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 bg-[#090e0b] p-3 rounded-xl border border-[#1b2b20]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Overall Standing</span>
          <span className="text-xl font-mono font-bold text-[#00e575] flex items-center gap-1">
            <Award className="w-4 h-4" /> Rank #{team.rank || 1}
          </span>
          <span className="text-[11px] font-mono text-gray-400">{team.totalScore} Points</span>
        </div>
      </div>

      {/* Team Roster Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200 font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00e575]" />
            Team Member Roster ({team.members.length} Members)
          </h2>
          <span className="text-[11px] text-gray-400">Single-identity leader login active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.members.map((member) => (
            <Card
              key={member.id}
              className={`p-4 flex items-start gap-3.5 ${
                member.isLeader ? 'border-[#00b259]/40 bg-[#0e1912]' : ''
              }`}
            >
              <Avatar name={member.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                  {member.isLeader && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                      <Crown className="w-3 h-3" /> LEADER
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#00e575] font-medium mt-0.5">{member.roleInTeam}</p>
                <div className="mt-2 space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="font-mono truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="truncate">{member.college}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Verification Credentials Card */}
      <Card className="bg-[#090e0b]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00e575]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Identity & Access Credentials Notice
            </h3>
          </div>
          <Badge variant="green" size="sm">ACTIVE REGISTRATION</Badge>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          As per GFG Euphoria protocol, individual team members do not possess separate login credentials. All problem statement selection, file uploads, and milestone submissions must be performed via the registered Team Leader account ({team.leaderEmail}).
        </p>
      </Card>
    </div>
  );
};
