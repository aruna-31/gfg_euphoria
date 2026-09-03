import React, { useEffect, useState } from 'react';
import { roundService } from '../../services/roundService';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { Round, RoundStatus } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock, CheckCircle2, Play, Calendar, Award } from 'lucide-react';

export const AdminRoundsPage: React.FC = () => {
  const { addToast } = useNotification();
  const { playSuccess } = useAudio();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    setLoading(true);
    try {
      const data = await roundService.getAllRounds();
      setRounds(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (roundId: number, nextStatus: RoundStatus) => {
    try {
      await roundService.updateRoundStatus(roundId, nextStatus);
      const updated = await roundService.getAllRounds();
      setRounds(updated);
      playSuccess();
      addToast('SUCCESS', `Round ${roundId} state changed to ${nextStatus}!`);
    } catch {
      addToast('ALERT', 'Failed to update round state.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="border-b border-[#1b2b20] pb-5">
        <h1 className="text-2xl font-extrabold text-white">Round Lifecycle & Checkpoints</h1>
        <p className="text-xs text-gray-400 mt-1">
          Activate evaluation windows, change checkpoint statuses, and calibrate criteria weightages.
        </p>
      </div>

      <div className="space-y-4">
        {rounds.map((round) => (
          <Card key={round.id} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#18261d] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#00e575]">
                    ROUND 0{round.number}
                  </span>
                  <Badge
                    variant={
                      round.status === 'COMPLETED'
                        ? 'green'
                        : round.status === 'ACTIVE'
                        ? 'blue'
                        : 'gray'
                    }
                    size="sm"
                  >
                    {round.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">{round.title}</h2>
                <p className="text-xs text-gray-400">{round.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {round.status !== 'ACTIVE' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStatusChange(round.id, 'ACTIVE')}
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                  >
                    Set as Active
                  </Button>
                )}
                {round.status !== 'COMPLETED' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleStatusChange(round.id, 'COMPLETED')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Mark Completed
                  </Button>
                )}
                {round.status !== 'UPCOMING' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStatusChange(round.id, 'UPCOMING')}
                  >
                    Reset to Upcoming
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#080d0a] p-3 rounded-xl border border-[#17251c]">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-[#00e575]" />
                <span>Start: {new Date(round.startTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>End: {new Date(round.endTime).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-gray-300 uppercase tracking-wider block mb-2 font-bold">
                Configured Evaluation Criteria ({round.criteria.length} Dimensions)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {round.criteria.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 bg-[#060907] border border-[#18261d] rounded-lg flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-300 truncate mr-2">{c.name}</span>
                    <span className="text-xs font-mono text-[#00e575] font-bold">
                      Max {c.maxScore} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
