import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { roundService } from '../../services/roundService';
import { Team, ProblemStatement, Round } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  FileCode2,
  Users,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const LeaderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [allTeams, rounds] = await Promise.all([
        teamService.getAllTeams(),
        roundService.getAllRounds(),
      ]);

      let myTeam: Team | null = allTeams.find((t) => 
        t.id === user?.teamId || 
        t.leaderEmail.toLowerCase() === user?.email?.toLowerCase()
      ) || allTeams[0] || null;

      if (!myTeam && user?.email) {
        myTeam = await teamService.getTeamByLeaderEmail(user.email);
      }

      setTeam(myTeam);

      if (myTeam?.problemStatementId) {
        const prob = await problemService.getProblemById(myTeam.problemStatementId);
        setProblem(prob);
      }

      const current = rounds.find((r) => r.status === 'ACTIVE') || rounds[0] || null;
      setActiveRound(current);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Team Leader Command Center...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="bg-white border border-pink-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-mono font-bold text-pink-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TEAM LEADER COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Welcome, {user?.name || team?.leaderName || 'Leader'}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Manage your team submissions, problem statement selection, and checkpoint readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/team/round-status')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Round Status
          </Button>
        </div>
      </div>

      {/* 2. Grid of Core Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* A. Current Active Round */}
        <Card className="p-5 flex flex-col justify-between bg-white border-pink-200">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-pink-100 pb-3">
              <span className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-600" />
                Current Active Round
              </span>
              <Badge variant="pink" size="sm">
                ROUND {activeRound?.id || 1} ACTIVE
              </Badge>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1">
              {activeRound?.name || 'Round 1: Problem Definition & Prototype'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {activeRound?.description}
            </p>

            <div className="space-y-2 text-xs text-gray-700 bg-[#FAF8FA] p-3 rounded-xl border border-pink-100">
              <span className="text-[11px] font-mono text-pink-700 uppercase block font-bold">
                Evaluation Deliverables:
              </span>
              {activeRound?.instructions.slice(0, 2).map((ins, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">Max Score: {activeRound?.maxScore || 100} pts</span>
            <button
              onClick={() => navigate('/team/round-status')}
              className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Criteria</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* B. Selected Problem Statement */}
        <Card className="p-5 flex flex-col justify-between bg-white border-pink-200">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-pink-100 pb-3">
              <span className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-pink-600" />
                Problem Statement
              </span>
              {problem ? (
                <Badge variant="pink" size="sm">
                  ✓ SELECTION LOCKED
                </Badge>
              ) : (
                <Badge variant="amber" size="sm">
                  NOT SELECTED
                </Badge>
              )}
            </div>

            {problem ? (
              <>
                <span className="text-xs font-mono text-pink-700 font-bold">{problem.id} • {problem.category}</span>
                <h3 className="text-base font-bold text-gray-900 mt-1 mb-2">
                  {problem.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {problem.shortDescription}
                </p>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-gray-900">No Problem Selected</p>
                <p className="text-xs text-gray-500">
                  Select and lock your official hackathon challenge to proceed.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/team/problem-statement')}
                  className="mt-2"
                >
                  Browse Problem Statements
                </Button>
              </div>
            )}
          </div>

          {problem && (
            <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-mono">Owner: {problem.problemOwner}</span>
              <button
                onClick={() => navigate('/team/problem-statement')}
                className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View Specifications</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </Card>

        {/* C. Team Summary */}
        <Card className="p-5 flex flex-col justify-between bg-white border-pink-200">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-pink-100 pb-3">
              <span className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-600" />
                Team Roster Summary
              </span>
              <span className="text-xs font-mono text-pink-700 font-bold bg-pink-50 px-2.5 py-0.5 rounded border border-pink-200">
                {team?.id}
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <Avatar
                src={team?.photoUrl}
                name={team?.name || 'Team'}
                size="lg"
                className="ring-2 ring-pink-200"
              />
              <div>
                <h3 className="text-base font-bold text-gray-900">{team?.name}</h3>
                <p className="text-xs text-gray-600">{team?.college}</p>
                <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                  Leader: {team?.leaderName} ({team?.leaderEmail})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#FAF8FA] p-3 rounded-xl border border-pink-100 text-center">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Members</span>
                <span className="text-sm font-black text-gray-900">{team?.members?.length || 4}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Stage</span>
                <span className="text-sm font-black text-pink-600">Round {team?.currentRound || 1}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Status</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">{team?.status?.replace(/_/g, ' ') || 'ACTIVE'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Squad Photo: {team?.photoUrl ? 'Verified' : 'Pending Upload'}
            </span>
            <button
              onClick={() => navigate('/team/profile')}
              className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Roster</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* D. Squad Photo Upload Quick-Card */}
        <Card className="p-5 flex flex-col justify-between bg-white border-pink-200">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-pink-100 pb-3">
              <span className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
                Squad Verification
              </span>
              <Badge variant={team?.photoUrl ? 'pink' : 'amber'} size="sm">
                {team?.photoUrl ? 'VERIFIED' : 'PENDING'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Team Identity Verification</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Upload your 4-member squad photograph to verify identity for evaluations and podium standings.
                </p>
              </div>

              <div className="p-3 bg-[#FAF8FA] rounded-xl border border-pink-100 text-xs space-y-1.5 text-gray-700">
                <p className="font-bold text-gray-900">Checklist Status:</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className={team?.problemStatementId ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                    {team?.problemStatementId ? '✓' : '○'}
                  </span>
                  <span>Problem statement locked</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className={team?.photoUrl ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                    {team?.photoUrl ? '✓' : '○'}
                  </span>
                  <span>Official squad photo verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Photo: {team?.photoUrl ? 'Saved in database' : 'Action Required'}</span>
            <button
              onClick={() => navigate('/team/photo')}
              className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{team?.photoUrl ? 'Update Photo' : 'Upload Group Photo'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

