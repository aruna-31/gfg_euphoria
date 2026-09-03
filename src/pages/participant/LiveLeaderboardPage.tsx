import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { leaderboardService } from '../../services/leaderboardService';
import { LeaderboardEntry } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  Trophy,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
  Sparkles,
  Zap,
  Building,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveLeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const { playRankUp } = useAudio();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [roundFilter, setRoundFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState<string>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [roundFilter]);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardService.getLeaderboard(roundFilter);
      setLeaderboard(data);
    } catch {
      // ignore
    }
  };

  const handleSimulateTick = async () => {
    setIsSimulating(true);
    try {
      playRankUp();
      const updated = await leaderboardService.simulateLiveShift();
      setLeaderboard(updated);
    } finally {
      setIsSimulating(false);
    }
  };

  const colleges = ['ALL', ...Array.from(new Set(leaderboard.map((e) => e.college)))];

  const filteredEntries = leaderboard.filter((entry) => {
    const matchesSearch =
      entry.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.teamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = collegeFilter === 'ALL' || entry.college === collegeFilter;
    return matchesSearch && matchesCollege;
  });

  const topThree = filteredEntries.slice(0, 3);
  const remainingTeams = filteredEntries.slice(3);

  const getRankTrend = (entry: LeaderboardEntry) => {
    const diff = entry.previousRank - entry.rank;
    if (diff > 0) {
      return (
        <span className="inline-flex items-center text-[10px] font-mono font-bold text-[#00e575] bg-[#00b259]/15 px-1.5 py-0.5 rounded border border-[#00b259]/30">
          <TrendingUp className="w-3 h-3 mr-0.5" /> +{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center text-[10px] font-mono font-bold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/30">
          <TrendingDown className="w-3 h-3 mr-0.5" /> {diff}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-mono text-gray-500">
        <Minus className="w-3 h-3 mr-0.5" /> 0
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#142217] text-[#00e575] border border-[#203627]">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Live Hackathon Leaderboard
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e575] animate-live-dot" />
              </h1>
              <p className="text-xs text-gray-400">
                Round-wise synchronous standings based on official jury evaluation results
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateTick}
            isLoading={isSimulating}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Simulate Live Shift
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={loadLeaderboard}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Round Selector Bar & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0f0c] p-2.5 rounded-xl border border-[#1d2d22]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-gray-400 mr-2 uppercase tracking-wider hidden sm:inline">
            Round:
          </span>
          {(['all', 1, 2, 3] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoundFilter(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                roundFilter === r
                  ? 'bg-[#00b259] text-black font-bold shadow-md shadow-[#00b259]/20'
                  : 'bg-[#101712] text-gray-400 hover:text-white hover:bg-[#152219]'
              }`}
            >
              {r === 'all' ? 'All Rounds (Aggregate)' : `Round ${r}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team or college..."
              className="w-full bg-[#080d0a] border border-[#1b2b20] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
            />
          </div>

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="bg-[#080d0a] border border-[#1b2b20] rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00b259] max-w-[160px] truncate"
          >
            {colleges.map((col) => (
              <option key={col} value={col} className="bg-[#080d0a] text-white">
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- OFFICIAL REQUIREMENTS PDF SPEC: 1st, 2nd, 3rd PODIUM PEDESTAL --- */}
      {topThree.length >= 3 && (
        <Card className="p-6 pt-8 pb-10 bg-gradient-to-b from-[#0d1612] via-[#09110d] to-[#060a08] border border-[#1f3326] relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b border-[#18271e] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00e575]" />
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Podium Contenders (Positions 1, 2 & 3)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#00e575] bg-[#00b259]/15 px-2.5 py-0.5 rounded-full border border-[#00b259]/30">
              SYNCHRONOUS LEADERBOARD
            </span>
          </div>

          {/* 3 Pedestals Container */}
          <div className="flex items-end justify-center gap-2 sm:gap-6 pt-16 max-w-2xl mx-auto">
            {/* 2nd Place: Left Pedestal (Medium Height) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center max-w-[180px]"
            >
              {/* Avatar, Team Name & Score sitting above pillar */}
              <div className="flex flex-col items-center text-center mb-3">
                <div className="relative mb-2">
                  <Avatar
                    src={topThree[1].photoUrl}
                    name={topThree[1].teamName}
                    size="lg"
                    className="ring-3 ring-slate-400 shadow-xl shadow-slate-400/20"
                  />
                  <span className="absolute -bottom-2 -right-1 bg-slate-500 text-white font-mono text-[10px] font-bold px-1.5 rounded-full border border-slate-300">
                    2
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white truncate max-w-[140px]">
                  {topThree[1].teamName}
                </h3>
                <p className="text-[10px] text-gray-400 truncate max-w-[130px]">{topThree[1].college}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-slate-200 bg-[#16212a] border border-slate-500/40 px-2.5 py-0.5 rounded-full">
                    {topThree[1].totalScore} pts
                  </span>
                  {getRankTrend(topThree[1])}
                </div>
              </div>

              {/* 3D-styled Podium Block 2 */}
              <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-[#2a3848] via-[#1e2a36] to-[#121b22] border-t-2 border-slate-300 rounded-t-2xl flex flex-col items-center justify-center shadow-2xl relative group">
                <span className="text-5xl sm:text-6xl font-black font-mono text-slate-300/40 select-none">
                  2
                </span>
                <span className="text-[10px] font-mono text-slate-300 tracking-wider uppercase font-bold mt-1">
                  2ND PLACE
                </span>
              </div>
            </motion.div>

            {/* 1st Place: Center Pedestal (TALLEST - GOLD CROWN) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center max-w-[200px]"
            >
              {/* Gold Champion Header */}
              <div className="flex flex-col items-center text-center mb-3">
                <div className="relative mb-2">
                  <Avatar
                    src={topThree[0].photoUrl}
                    name={topThree[0].teamName}
                    size="xl"
                    className="ring-4 ring-amber-400 shadow-2xl shadow-amber-400/40"
                  />
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black rounded-full p-1 shadow-lg animate-bounce">
                    <Crown className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-amber-500 text-black font-mono text-[10px] font-black px-1.5 rounded-full border border-amber-300">
                    1
                  </span>
                </div>
                <h3 className="text-sm font-black text-amber-300 truncate max-w-[160px]">
                  {topThree[0].teamName}
                </h3>
                <p className="text-[10px] text-amber-200/80 truncate max-w-[150px]">{topThree[0].college}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/20 border border-amber-400/50 px-3 py-0.5 rounded-full shadow-md shadow-amber-500/20">
                    {topThree[0].totalScore} pts
                  </span>
                  {getRankTrend(topThree[0])}
                </div>
              </div>

              {/* 3D-styled Podium Block 1 (TALLEST) */}
              <div className="w-full h-44 sm:h-48 bg-gradient-to-b from-[#3d3216] via-[#29210c] to-[#171305] border-t-2 border-amber-400 rounded-t-2xl flex flex-col items-center justify-center shadow-2xl shadow-amber-500/10 relative">
                <span className="text-6xl sm:text-7xl font-black font-mono text-amber-400/50 select-none">
                  1
                </span>
                <span className="text-[11px] font-mono text-amber-300 tracking-wider uppercase font-extrabold mt-1">
                  1ST PLACE • CHAMPION
                </span>
              </div>
            </motion.div>

            {/* 3rd Place: Right Pedestal (Lowest Height) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col items-center max-w-[180px]"
            >
              {/* Avatar, Team Name & Score sitting above pillar */}
              <div className="flex flex-col items-center text-center mb-3">
                <div className="relative mb-2">
                  <Avatar
                    src={topThree[2].photoUrl}
                    name={topThree[2].teamName}
                    size="lg"
                    className="ring-3 ring-orange-500/80 shadow-xl shadow-orange-500/20"
                  />
                  <span className="absolute -bottom-2 -right-1 bg-orange-600 text-white font-mono text-[10px] font-bold px-1.5 rounded-full border border-orange-400">
                    3
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white truncate max-w-[140px]">
                  {topThree[2].teamName}
                </h3>
                <p className="text-[10px] text-gray-400 truncate max-w-[130px]">{topThree[2].college}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold text-orange-200 bg-[#2b190f] border border-orange-500/40 px-2.5 py-0.5 rounded-full">
                    {topThree[2].totalScore} pts
                  </span>
                  {getRankTrend(topThree[2])}
                </div>
              </div>

              {/* 3D-styled Podium Block 3 */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-[#3a2016] via-[#27150c] to-[#140b06] border-t-2 border-orange-500 rounded-t-2xl flex flex-col items-center justify-center shadow-2xl relative">
                <span className="text-5xl sm:text-6xl font-black font-mono text-orange-500/40 select-none">
                  3
                </span>
                <span className="text-[10px] font-mono text-orange-300 tracking-wider uppercase font-bold mt-1">
                  3RD PLACE
                </span>
              </div>
            </motion.div>
          </div>
        </Card>
      )}

      {/* --- SLEEK LEADERBOARD TABLE (Below Podium) --- */}
      <div className="bg-[#090e0b] border border-[#1a2b20] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#17251c] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-200">
            Synchronous Standings Roster ({filteredEntries.length} Teams)
          </h3>
          <span className="text-[11px] font-mono text-gray-400">
            Current Team highlighted in green
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#17251c] bg-[#070b09] text-[11px] font-mono text-gray-400 uppercase">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4 w-16 text-center">Trend</th>
                <th className="py-3 px-4">Team & College</th>
                <th className="py-3 px-4 hidden sm:table-cell">Challenge Track</th>
                <th className="py-3 px-3 text-center hidden md:table-cell">Round 1</th>
                <th className="py-3 px-3 text-center hidden md:table-cell">Round 2</th>
                <th className="py-3 px-4 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132017] text-xs">
              <AnimatePresence>
                {filteredEntries.map((entry) => {
                  const isCurrentTeam = entry.teamId === user?.teamId;

                  return (
                    <motion.tr
                      key={entry.teamId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`transition-colors ${
                        isCurrentTeam
                          ? 'bg-[#00b259]/10 hover:bg-[#00b259]/15 border-l-4 border-l-[#00e575]'
                          : 'hover:bg-[#0f1712]'
                      }`}
                    >
                      {/* Rank circle badge */}
                      <td className="py-3 px-4 text-center font-mono">
                        {entry.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                            1
                          </span>
                        ) : entry.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400/20 text-slate-200 font-bold border border-slate-400/40">
                            2
                          </span>
                        ) : entry.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40">
                            3
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#121c16] text-gray-400 font-bold border border-[#1f3024]">
                            {entry.rank}
                          </span>
                        )}
                      </td>

                      {/* Rank Movement Trend */}
                      <td className="py-3 px-4 text-center">{getRankTrend(entry)}</td>

                      {/* Team Name and Photo/Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={entry.photoUrl}
                            name={entry.teamName}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white truncate">
                                {entry.teamName}
                              </span>
                              {isCurrentTeam && (
                                <Badge variant="green" size="sm">
                                  YOUR TEAM
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">
                              {entry.college} • <span className="font-mono">{entry.teamId}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Problem Title */}
                      <td className="py-3 px-4 hidden sm:table-cell text-gray-300 max-w-xs truncate">
                        {entry.problemTitle || 'Pending Selection'}
                      </td>

                      {/* Round 1 Score */}
                      <td className="py-3 px-3 text-center font-mono text-gray-400 hidden md:table-cell">
                        {entry.roundScores[1] || '—'}
                      </td>

                      {/* Round 2 Score */}
                      <td className="py-3 px-3 text-center font-mono text-gray-400 hidden md:table-cell">
                        {entry.roundScores[2] || '—'}
                      </td>

                      {/* Total Score */}
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-sm text-[#00e575]">
                          {entry.totalScore}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
