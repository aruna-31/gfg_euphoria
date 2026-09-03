import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { evaluationService } from '../../services/evaluationService';
import { teamService } from '../../services/teamService';
import { roundService } from '../../services/roundService';
import { Evaluation, Team, Round } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, History, ArrowRight } from 'lucide-react';

export const EvaluationHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [teams, setTeams] = useState<Map<string, Team>>(new Map());
  const [rounds, setRounds] = useState<Map<number, Round>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const evaluatorId = user?.evaluatorId || 'eval-1';
      const [allEvals, allTeams, allRounds] = await Promise.all([
        evaluationService.getEvaluationsByEvaluator(evaluatorId),
        teamService.getAllTeams(),
        roundService.getAllRounds(),
      ]);

      setEvaluations(allEvals);
      setTeams(new Map(allTeams.map((t) => [t.id, t])));
      setRounds(new Map(allRounds.map((r) => [r.id, r])));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="border-b border-[#1b2b20] pb-5">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#00e575]" />
          <h1 className="text-2xl font-extrabold text-white">Submitted Evaluations Log</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Historical record of all team score submissions and qualitative remarks.
        </p>
      </div>

      {evaluations.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p className="text-sm">No submitted evaluations found for your profile yet.</p>
          <Button
            size="sm"
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/evaluator/teams')}
          >
            Go to Assigned Teams
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {evaluations.map((ev) => {
            const team = teams.get(ev.teamId);
            const round = rounds.get(ev.roundId);

            return (
              <Card key={ev.id} className="p-5 space-y-3 bg-[#090e0b]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#18261d] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#00e575] uppercase">
                      Round {ev.roundId} • {round?.name}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {team?.name || ev.teamId}
                    </h3>
                    <p className="text-xs text-gray-400">{team?.college}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-gray-400 block">Score Submitted</span>
                    <span className="text-xl font-mono font-bold text-[#00e575]">
                      {ev.totalScore} / 100
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#060a08] rounded-xl border border-[#16241b] text-xs text-gray-300">
                  <p className="italic">"{ev.feedback}"</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-gray-500">
                    Timestamp: {new Date(ev.submittedAt || ev.evaluatedAt || Date.now()).toLocaleString()}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/evaluator/evaluate/${ev.teamId}`)}
                  >
                    View / Edit Marks
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
