import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { roundService } from '../../services/roundService';
import { Team, ProblemStatement, Round } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  FileCode2,
  ArrowRight,
  Sparkles,
  AlertCircle,
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
      <div className="py-20 text-center text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading Team Leader Command Center...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="bg-[#0F1E2E]/90 border border-emerald-500/25 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>HACKODESSEY 4.0 • TEAM LEADER COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
            Welcome, {user?.name || team?.leaderName || 'Leader'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your challenge selection, squad members roster, and photo verification.
          </p>
        </div>
      </div>

      {/* 2. Core Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* A. Current Active Round */}
        <Card className="p-5 flex flex-col justify-between bg-[#0F1E2E]/90 border-emerald-500/20">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-emerald-500/15 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
                Current Active Round
              </span>
              <Badge variant="gfg" size="sm">
                ROUND {activeRound?.id || 1} ACTIVE
              </Badge>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {activeRound?.name || 'Round 1: Problem Definition & Prototype'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeRound?.description}
            </p>
          </div>
        </Card>

        {/* B. Selected Problem Statement */}
        <Card className="p-5 flex flex-col justify-between bg-[#0F1E2E]/90 border-emerald-500/20">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-emerald-500/15 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-[#22C55E]" />
                Problem Statement
              </span>
              {problem ? (
                <Badge variant="gfg" size="sm">
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
                <span className="text-xs font-mono text-emerald-400 font-bold">{problem.id} • {problem.category}</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">
                  {problem.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {problem.shortDescription}
                </p>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-white">No Problem Selected</p>
                <p className="text-xs text-slate-400">
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
            <div className="mt-4 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Owner: {problem.problemOwner}</span>
              <button
                onClick={() => navigate('/team/problem-statement')}
                className="text-[#22C55E] hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View Specifications</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
