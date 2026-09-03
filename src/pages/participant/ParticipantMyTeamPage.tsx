import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { participantService } from '../../services/participantService';
import { problemService } from '../../services/problemService';
import { Team, ProblemStatement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Users, Crown, ShieldAlert, Mail, Phone, FileCode2 } from 'lucide-react';

export const ParticipantMyTeamPage: React.FC = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const myTeam = await participantService.getMyTeam(user?.teamId || 'TEAM-001');
      setTeam(myTeam);
      if (myTeam?.problemStatementId) {
        const prob = await problemService.getProblemById(myTeam.problemStatementId);
        setProblem(prob);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400 font-mono text-xs">Loading Team Details...</div>;
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#141f17] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            My Team Roster
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Registered team composition, member roles, and chosen problem statement.
          </p>
        </div>
        <Badge variant="blue" size="sm">
          READ-ONLY ACCESS
        </Badge>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-3 text-xs text-blue-300">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          Participant Notice: Problem statement selection and group photo uploads can only be executed by your registered Team Leader ({team?.leaderName}).
        </span>
      </div>

      {/* Team Summary Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#142117]">
          <div className="flex items-center gap-4">
            <Avatar src={team?.photoUrl} name={team?.name || 'Team'} size="xl" className="ring-2 ring-[#1e3324]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{team?.name}</h2>
                <span className="text-xs font-mono text-[#00e575] bg-[#00b259]/10 px-2 py-0.5 rounded border border-[#00b259]/20">
                  {team?.id}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{team?.college}</p>
              <p className="text-[11px] font-mono text-gray-500 mt-1">
                Registered: {new Date(team?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
            <span className="text-xs text-gray-400">Total Score</span>
            <span className="text-2xl font-mono font-bold text-[#00e575]">{team?.totalScore} pts</span>
            <span className="text-xs text-gray-500 font-mono">Rank #{team?.rank} of 8</span>
          </div>
        </div>

        {/* Members Table */}
        <div className="mt-6">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#00e575]" />
            Registered Members ({team?.members.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {team?.members.map((m) => {
              const isCurrentUser = m.id === user?.id || m.email.toLowerCase() === user?.email.toLowerCase();

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    isCurrentUser
                      ? 'bg-[#0e1f15] border-[#00b259]/40 ring-1 ring-[#00b259]/20'
                      : 'bg-[#070a08] border-[#141f17]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Avatar name={m.name} size="sm" />
                    {m.isLeader ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Crown className="w-2.5 h-2.5" /> LEADER
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded border border-gray-500/20">
                        MEMBER
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-white truncate">
                    {m.name} {isCurrentUser && <span className="text-[10px] font-mono text-[#00e575] font-normal">(You)</span>}
                  </p>
                  <p className="text-xs text-[#00e575] font-mono mt-0.5">{m.roleInTeam}</p>

                  <div className="mt-3 pt-2.5 border-t border-[#121c15] space-y-1 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-gray-500 shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem Statement Card */}
        {problem && (
          <div className="mt-6 pt-5 border-t border-[#141f17]">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-[#00e575]" />
              Assigned Problem Statement
            </h3>
            <div className="p-4 rounded-xl bg-[#070a08] border border-[#141f17]">
              <span className="text-xs font-mono text-[#00e575] font-semibold">{problem.id} • {problem.category}</span>
              <h4 className="text-sm font-bold text-white mt-1">{problem.title}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{problem.shortDescription}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
