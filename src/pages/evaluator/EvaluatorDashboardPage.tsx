import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { evaluatorService } from '../../services/evaluatorService';
import { teamService } from '../../services/teamService';
import { roundService } from '../../services/roundService';
import { problemService } from '../../services/problemService';
import { Evaluator, Team, Round, ProblemStatement } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';

export const EvaluatorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [evaluator, setEvaluator] = useState<Evaluator | null>(null);
  const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [problems, setProblems] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const allEvaluators = await evaluatorService.getAllEvaluators();
      const current = allEvaluators.find((item) => item.email.toLowerCase() === user?.email.toLowerCase());
      setEvaluator(current || {
        id: user?.evaluatorId || user?.id || 'evaluator', name: 'Evaluator Workspace', email: user?.email || '',
        designation: 'Evaluator', organization: 'Not provided', expertise: [], assignedTeamIds: [], assignedRounds: [],
        completedCount: 0, pendingCount: 0, status: 'ACTIVE',
      });
      setAssignedTeams([]);
      setActiveRound(null);
      setProblems(new Map());
    } finally {
      setLoading(false);
    }
  };

  if (loading || !evaluator) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 mt-2 font-mono">Loading evaluator queue...</p>
      </div>
    );
  }

  const completedCount = assignedTeams.filter((t) => t.roundScores?.[activeRound?.number || 2] !== undefined).length;
  const pendingCount = assignedTeams.length - completedCount;

  // Calculate average score for evaluated teams
  const scores = assignedTeams
    .map((t) => t.roundScores?.[activeRound?.number || 2])
    .filter((s): s is number => s !== undefined);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Evaluator Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0e1711] via-[#122217] to-[#0a110d] border border-[#203627] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={evaluator.avatarUrl}
            name={evaluator.name}
            size="xl"
            className="ring-3 ring-[#00b259]/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{evaluator.name}</h1>
              <Badge variant="green" size="sm">
                JURY PANEL
              </Badge>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              {evaluator.designation} â€¢ {evaluator.organization}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {evaluator.expertise.map((exp, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 bg-[#090e0b] border border-[#1d2d22] text-[#00e575] rounded"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#090f0c] p-3.5 rounded-xl border border-[#1c2e22] text-right">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Assigned Round</span>
          <span className="text-sm font-bold text-white block mt-0.5">
            Round {activeRound?.number}: {activeRound?.name}
          </span>
          <Badge variant="blue" size="sm" className="mt-1">
            WINDOW OPEN
          </Badge>
        </div>
      </div>

      {/* Evaluator KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Teams"
          value={assignedTeams.length}
          subtitle="Allocated to your jury docket"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Evaluations"
          value={pendingCount}
          subtitle="Awaiting scoring & notes"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          highlight={pendingCount > 0}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Submitted to master leaderboard"
          icon={<CheckCircle2 className="w-5 h-5 text-[#00e575]" />}
        />
        <StatCard
          title="Average Score"
          value={avgScore > 0 ? `${avgScore}/100` : 'â€”'}
          subtitle="Across your evaluations"
          icon={<Award className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Evaluator Teams Workload Table */}
      <div className="bg-[#090e0b] border border-[#1a2b20] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#17251c] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-200">
              Assigned Teams Queue ({assignedTeams.length} Teams)
            </h2>
            <p className="text-[11px] text-gray-400">
              Click 'Evaluate' to inspect project deliverables and assign criteria marks
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/evaluator/history')}
          >
            View Completed Logs
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#17251c] bg-[#070b09] text-[11px] font-mono text-gray-400 uppercase">
                <th className="py-3 px-4">Team Name & College</th>
                <th className="py-3 px-4 hidden md:table-cell">Assigned Problem</th>
                <th className="py-3 px-4 text-center">Round</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132017] text-xs">
              {assignedTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No teams currently assigned to your queue.
                  </td>
                </tr>
              ) : (
                assignedTeams.map((t) => {
                  const hasEvaluated = t.roundScores?.[activeRound?.number || 2] !== undefined;
                  const probTitle = t.problemStatementId ? problems.get(t.problemStatementId) : 'Problem Pending';

                  return (
                    <tr key={t.id} className="hover:bg-[#0e1611] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={t.photoUrl} name={t.name} size="sm" />
                          <div>
                            <span className="font-bold text-white block">{t.name}</span>
                            <span className="text-[11px] text-gray-400">
                              {t.college} â€¢ <span className="font-mono text-[#00e575]">{t.id}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 hidden md:table-cell text-gray-300 max-w-xs truncate">
                        <span className="font-mono text-[11px] text-gray-500 block">
                          {t.problemStatementId || 'N/A'}
                        </span>
                        <span className="truncate">{probTitle}</span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-gray-300">
                        Round {activeRound?.number}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {hasEvaluated ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00e575] bg-[#00b259]/15 px-2.5 py-0.5 rounded border border-[#00b259]/30">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.roundScores[activeRound?.number || 2]}/100
                          </span>
                        ) : (
                          <Badge variant="amber" size="sm">
                            PENDING
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant={hasEvaluated ? 'secondary' : 'primary'}
                          onClick={() => navigate(`/evaluator/evaluate/${t.id}`)}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          {hasEvaluated ? 'Review / Edit' : 'Evaluate Team'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
