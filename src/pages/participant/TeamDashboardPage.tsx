import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { roundService } from '../../services/roundService';
import { Team, ProblemStatement, Round } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  Trophy,
  FileCode2,
  Image,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TeamDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const teamId = user?.teamId || 'TEAM-001';
        const teamData = await teamService.getTeamById(teamId);
        setTeam(teamData);

        if (teamData?.problemStatementId) {
          const probData = await problemService.getProblemById(teamData.problemStatementId);
          setProblem(probData);
        }

        const roundData = await roundService.getActiveRound();
        setActiveRound(roundData);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-mono">Synchronizing team telemetry...</p>
      </div>
    );
  }

  const stages = [
    { label: 'Registration', status: 'COMPLETED' },
    { label: 'Problem Selection', status: team?.problemStatementId ? 'COMPLETED' : 'IN_PROGRESS' },
    { label: 'Photo Verification', status: team?.photoUrl ? 'COMPLETED' : 'IN_PROGRESS' },
    { label: 'Round 1 (Blueprint)', status: team?.roundScores?.[1] ? 'COMPLETED' : 'IN_PROGRESS' },
    { label: 'Round 2 (Prototype)', status: activeRound?.number === 2 ? 'ACTIVE' : 'UPCOMING' },
    { label: 'Grand Finale', status: 'UPCOMING' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1611] via-[#0f1d14] to-[#0a100d] border border-[#203627] p-6 sm:p-8"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#00b259]/10 to-transparent pointer-events-none hidden md:block" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#122418] border border-[#1f3d29] text-xs font-mono text-[#00e575] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GFG KARE HACKATHON LIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, <span className="text-[#00e575]">{team?.name || 'Your Team'}</span> 🚀
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Your hackathon mission is active. Complete checkpoint evaluations, submit your deliverables, and track your position on the live podium.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/team/leaderboard')}
              variant="outline"
              leftIcon={<Trophy className="w-4 h-4" />}
            >
              View Podium
            </Button>
            <Button
              onClick={() => navigate('/team/status')}
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Round Status
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mandatory Photo Upload Action Banner (Section 2 Requirement) */}
      {team?.problemStatementId && !team?.photoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>Official Action Required: Upload Team Group Photo</span>
              </p>
              <p className="text-[11px] text-gray-300">
                Rule: "Once the problem statement selection is completed, the respective team must upload a group photo."
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/team/upload-photo')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shrink-0 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
          >
            Upload Group Photo Now
          </Button>
        </motion.div>
      )}

      {/* Primary 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Team Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Team Profile
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{team?.name}</h2>
                <p className="text-xs text-gray-400">{team?.college}</p>
              </div>
              <Badge variant="green" size="sm">
                {team?.id}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#090e0b] border border-[#1a291f] mb-4">
              <Avatar
                src={team?.photoUrl}
                name={team?.name || 'Team'}
                size="lg"
                className="ring-2 ring-[#00b259]/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-200 truncate">
                  {team?.leaderName} (Leader)
                </p>
                <p className="text-[11px] font-mono text-gray-400 truncate">
                  {team?.leaderEmail}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#00e575]">
                  <Users className="w-3 h-3" />
                  <span>{team?.members?.length || 4} Verified Members</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/team/upload-photo')}
            className="w-full mt-2"
            leftIcon={<Image className="w-3.5 h-3.5" />}
          >
            {team?.photoUrl ? 'Manage Group Photo' : 'Upload Team Photo (Required)'}
          </Button>
        </Card>

        {/* 2. Current Round Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Current Stage
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {activeRound?.name}: Mid-Checkpoint
                </h2>
                <p className="text-xs text-gray-400">{activeRound?.title}</p>
              </div>
              <Badge variant="blue" size="sm">
                IN PROGRESS
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-[#090e0b] border border-[#1a291f] space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Current Standing:</span>
                <span className="font-mono font-bold text-[#00e575] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Rank #{team?.rank || 1}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Total Aggregate Score:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {team?.totalScore || 0} / 200
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Round 1 Blueprint:</span>
                <span className="font-mono text-emerald-400">
                  {team?.roundScores?.[1] ? `${team.roundScores[1]}/100 (Scored)` : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Round 2 Prototype:</span>
                <span className="font-mono text-sky-400">Under Evaluation</span>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/team/status')}
            className="w-full mt-2"
            leftIcon={<Clock className="w-3.5 h-3.5" />}
          >
            Review Round Breakdown
          </Button>
        </Card>

        {/* 3. Problem Statement Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Challenge Track
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {problem ? problem.category : 'No Problem Chosen'}
                </h2>
                <p className="text-xs text-gray-400">
                  {problem ? problem.id : 'Selection required'}
                </p>
              </div>
              <Badge variant={problem ? 'purple' : 'amber'} size="sm">
                {problem ? 'ASSIGNED' : 'ACTION NEEDED'}
              </Badge>
            </div>

            {problem ? (
              <div className="p-3 rounded-xl bg-[#090e0b] border border-[#1a291f] mb-4">
                <p className="text-xs font-semibold text-gray-200 line-clamp-2">
                  {problem.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                  {problem.shortDescription}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="green" size="sm">
                    {problem.difficulty}
                  </Badge>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Owner: {problem.problemOwner || 'GFG Lab'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-4">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Problem selection pending</span>
                </div>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  Choose your domain challenge from the official repository before round 2 evaluations start.
                </p>
              </div>
            )}
          </div>

          <Button
            variant={problem ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => navigate('/team/problem-statement')}
            className="w-full mt-2"
            leftIcon={<FileCode2 className="w-3.5 h-3.5" />}
          >
            {problem ? 'Inspect Problem Specs' : 'Select Problem Statement'}
          </Button>
        </Card>
      </div>

      {/* Progress Timeline Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Hackathon Journey Progression
            </h2>
            <p className="text-xs text-gray-400">Milestone checkpoints for GFG Euphoria 2026</p>
          </div>
          <span className="text-xs font-mono text-[#00e575] bg-[#00b259]/15 px-2.5 py-1 rounded-full border border-[#00b259]/30">
            STAGE 4 / 6 ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, idx) => {
            const isDone = stage.status === 'COMPLETED';
            const isActive = stage.status === 'ACTIVE' || stage.status === 'IN_PROGRESS';

            return (
              <div
                key={stage.label}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isDone
                    ? 'bg-[#00b259]/10 border-[#00b259]/40 text-[#00e575]'
                    : isActive
                    ? 'bg-[#101e15] border-[#00e575] text-white shadow-md shadow-[#00e575]/10 ring-1 ring-[#00e575]'
                    : 'bg-[#080d0a] border-[#18261d] text-gray-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00e575]" />
                    ) : isActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e575] animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-600" />
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{stage.label}</p>
                </div>
                <p className="text-[10px] font-mono mt-2 uppercase tracking-wide opacity-80">
                  {stage.status.replace('_', ' ')}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/team/problem-statement')}
          className="p-3.5 rounded-xl bg-[#0e1612] hover:bg-[#142018] border border-[#1e2e23] hover:border-[#00b259]/40 text-left transition-all group cursor-pointer"
        >
          <FileCode2 className="w-5 h-5 text-[#00e575] mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-gray-200">Problem Statement</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Specifications & Deliverables</p>
        </button>

        <button
          onClick={() => navigate('/team/upload-photo')}
          className="p-3.5 rounded-xl bg-[#0e1612] hover:bg-[#142018] border border-[#1e2e23] hover:border-[#00b259]/40 text-left transition-all group cursor-pointer"
        >
          <Image className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-gray-200">Group Photo</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Verification & Team Avatar</p>
        </button>

        <button
          onClick={() => navigate('/team/leaderboard')}
          className="p-3.5 rounded-xl bg-[#0e1612] hover:bg-[#142018] border border-[#1e2e23] hover:border-[#00b259]/40 text-left transition-all group cursor-pointer"
        >
          <Trophy className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-gray-200">Live Leaderboard</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Podium & Round Scores</p>
        </button>

        <button
          onClick={() => navigate('/team/profile')}
          className="p-3.5 rounded-xl bg-[#0e1612] hover:bg-[#142018] border border-[#1e2e23] hover:border-[#00b259]/40 text-left transition-all group cursor-pointer"
        >
          <Users className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-gray-200">Team Roster</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Member credentials & roles</p>
        </button>
      </div>
    </div>
  );
};
