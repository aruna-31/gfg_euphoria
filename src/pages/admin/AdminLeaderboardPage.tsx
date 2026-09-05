import React, { useEffect, useState } from 'react';
import { leaderboardService } from '../../services/leaderboardService';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { LeaderboardEntry } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Trophy, Lock, Unlock, RefreshCw, Sparkles, Award } from 'lucide-react';

export const AdminLeaderboardPage: React.FC = () => {
  const { addToast } = useNotification();
  const { playSuccess, playAlert } = useAudio();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isFrozen, setIsFrozen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await leaderboardService.getLeaderboard('all');
      setLeaderboard(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleFreeze = () => {
    const next = !isFrozen;
    setIsFrozen(next);
    if (next) {
      playAlert();
      addToast('WARNING', 'Leaderboard standings FROZEN for Grand Valedictory reveal.');
    } else {
      playSuccess();
      addToast('SUCCESS', 'Leaderboard UNLOCKED. Live scores streaming to participants.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Leaderboard Master Control</h1>
            <Badge variant={isFrozen ? 'amber' : 'green'} size="sm">
              {isFrozen ? 'STANDINGS FROZEN' : 'PUBLIC STREAM ACTIVE'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Publish standings, freeze podium visibility before awards ceremony, and audit score computations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant={isFrozen ? 'primary' : 'danger'}
            onClick={toggleFreeze}
            leftIcon={isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          >
            {isFrozen ? 'Unfreeze Standings' : 'Freeze Leaderboard'}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={loadLeaderboard}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Recalculate Ranks
          </Button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-[#090e0b] border border-[#1a2b20] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#070b09] border-b border-[#17251c] text-[11px] font-mono text-gray-400 uppercase">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Team & College</th>
                <th className="py-3 px-4">Leader</th>
                <th className="py-3 px-3 text-center">R1</th>
                <th className="py-3 px-3 text-center">R2</th>
                <th className="py-3 px-4 text-right">Aggregate Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132017]">
              {leaderboard.map((entry) => (
                <tr key={entry.teamId} className="hover:bg-[#0e1611] transition-colors">
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    {entry.rank <= 3 ? (
                      <span className="text-amber-400">#{entry.rank}</span>
                    ) : (
                      `#${entry.rank}`
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={entry.photoUrl} name={entry.teamName} size="sm" />
                      <div>
                        <span className="font-bold text-white block">{entry.teamName}</span>
                        <span className="text-[11px] text-gray-400">
                          {entry.college} • <span className="font-mono">{entry.teamId}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{entry.leaderName}</td>
                  <td className="py-3 px-3 text-center font-mono text-gray-400">
                    {entry.roundScores[1] || '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-gray-400">
                    {entry.roundScores[2] || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#00e575] text-sm">
                    {entry.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
