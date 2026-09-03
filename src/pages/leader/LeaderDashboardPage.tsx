import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { roundService } from '../../services/roundService';
import { participantService } from '../../services/participantService';
import { Team, ProblemStatement, Round, Announcement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  FileCode2,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const LeaderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [allTeams, rounds, ann] = await Promise.all([
        teamService.getAllTeams(),
        roundService.getAllRounds(),
        participantService.getAnnouncements(),
      ]);

      const myTeam = allTeams.find((t) => t.id === user?.teamId) || allTeams[0];
      setTeam(myTeam);

      if (myTeam?.problemStatementId) {
        const prob = await problemService.getProblemById(myTeam.problemStatementId);
        setProblem(prob);
      }

      const current = rounds.find((r) => r.status === 'ACTIVE') || rounds[0];
      setActiveRound(current);
      setAnnouncements(ann);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400 font-mono text-xs">
        Loading Team Leader Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="bg-[#0b120e] border border-[#162319] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#112217] border border-[#1d3d28] text-[11px] font-mono text-[#00e575] mb-2">
            <Sparkles className="w-3 h-3" />
            <span>TEAM LEADER COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome, {user?.name || 'Leader'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your team submissions, problem selection, and checkpoint readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/team/leaderboard')}
          >
            View Standings
          </Button>
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

      {/* 2. Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* A. Current Active Round */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-3">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00e575]" />
                Current Active Round
              </span>
              <Badge variant="green" size="sm">
                ROUND {activeRound?.id || 2} IN PROGRESS
              </Badge>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {activeRound?.name}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              {activeRound?.description}
            </p>

            <div className="space-y-2 text-xs text-gray-300 bg-[#070a08] p-3 rounded-xl border border-[#141f17]">
              <span className="text-[11px] font-mono text-gray-500 uppercase block font-semibold">
                Evaluation Deliverables:
              </span>
              {activeRound?.instructions.slice(0, 2).map((ins, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#00e575] font-bold">•</span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#142117] flex items-center justify-between text-xs">
            <span className="text-gray-400">Max Score: {activeRound?.maxScore} pts</span>
            <button
              onClick={() => navigate('/team/round-status')}
              className="text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Full Rubric Criteria</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* B. Selected Problem Statement */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-3">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-[#00e575]" />
                Problem Statement
              </span>
              {problem ? (
                <Badge variant="green" size="sm">
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
                <span className="text-xs font-mono text-[#00e575] font-semibold">{problem.id} • {problem.category}</span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">
                  {problem.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {problem.shortDescription}
                </p>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                <p className="text-sm font-semibold text-white">Not Selected</p>
                <p className="text-xs text-gray-400">
                  Choose your problem statement to continue.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/team/problem-statement')}
                  className="mt-2"
                >
                  View Problem Statements
                </Button>
              </div>
            )}
          </div>

          {problem && (
            <div className="mt-4 pt-3 border-t border-[#142117] flex items-center justify-between text-xs">
              <span className="text-gray-400">Owner: {problem.problemOwner}</span>
              <button
                onClick={() => navigate('/team/problem-statement')}
                className="text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Specifications</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </Card>

        {/* C. Team Summary (One Team Card Only - No duplicate name) */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-3">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#00e575]" />
                Team Summary
              </span>
              <span className="text-xs font-mono text-[#00e575] bg-[#00b259]/10 px-2 py-0.5 rounded border border-[#00b259]/20">
                {team?.id}
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <Avatar
                src={team?.photoUrl}
                name={team?.name || 'Team'}
                size="lg"
                className="ring-1 ring-[#1f3325]"
              />
              <div>
                <h3 className="text-base font-bold text-white">{team?.name}</h3>
                <p className="text-xs text-gray-400">{team?.college}</p>
                <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                  Leader: {team?.leaderName} ({team?.leaderEmail})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#070a08] p-3 rounded-xl border border-[#141f17] text-center">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Members</span>
                <span className="text-sm font-bold text-white">{team?.members.length || 3}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Current Rank</span>
                <span className="text-sm font-bold text-[#00e575]">#{team?.rank || 1}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Points</span>
                <span className="text-sm font-bold text-white">{team?.totalScore || 0} pts</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#142117] flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Squad Photo: {team?.photoUrl ? 'Verified' : 'Pending Upload'}
            </span>
            <button
              onClick={() => navigate('/team/profile')}
              className="text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Roster</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* D. Upcoming Deadline */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-3">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Upcoming Milestone Deadline
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                CHECKPOINT 2
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">Round 2 Prototype Cutoff</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Today at 06:00 PM IST (Jury scoring locks at 06:30 PM)
                </p>
              </div>

              <div className="p-3 bg-[#070a08] rounded-xl border border-[#141f17] text-xs space-y-1.5 text-gray-300">
                <p className="font-semibold text-white">Prerequisites Before Evaluator Arrival:</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-emerald-400">✓</span>
                  <span>Repository link committed & public</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-emerald-400">✓</span>
                  <span>Working demo running on local host or staging</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-emerald-400">✓</span>
                  <span>Official group photo uploaded for ID verification</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#142117] flex items-center justify-between text-xs">
            <span className="text-gray-400">Status: Evaluation Window Open</span>
            <button
              onClick={() => navigate('/team/photo')}
              className="text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Upload Group Photo</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>
      </div>

      {/* 3. Recent Announcements */}
      <div className="bg-[#0b120e] border border-[#162319] rounded-2xl p-6 text-left">
        <div className="flex items-center justify-between mb-4 border-b border-[#142117] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00e575]" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Official Hackathon Announcements
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-500">Live Broadcast</span>
        </div>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-3.5 rounded-xl bg-[#070a08] border border-[#142017] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      ann.category === 'IMPORTANT'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30 font-bold'
                        : ann.category === 'RULES'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{ann.content}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-gray-500 block">
                  {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] font-mono text-gray-400">{ann.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
