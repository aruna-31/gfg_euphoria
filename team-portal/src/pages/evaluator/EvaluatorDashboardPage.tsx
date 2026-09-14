import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { evaluatorService } from '../../services/evaluatorService';
import { teamService } from '../../services/teamService';
import { roundService } from '../../services/roundService';
import { problemService } from '../../services/problemService';
import { Evaluator, Team, Round } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
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

    // Auto-sync rounds updated by admin
    const interval = setInterval(() => {
      roundService.getAllRounds().then((rounds) => {
        const active = rounds.find((r) => r.status === 'ACTIVE') || null;
        setActiveRound(active);
      }).catch(() => {});
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [allEvaluators, allTeams, allRounds, allProblems] = await Promise.all([
        evaluatorService.getAllEvaluators(),
        teamService.getAllTeams(),
        roundService.getAllRounds(),
        problemService.getAllProblems(),
      ]);

      const current = allEvaluators.find(
        (item) =>
          item.email.toLowerCase() === user?.email?.toLowerCase() ||
          item.id.toLowerCase() === user?.id?.toLowerCase() ||
          item.id.toLowerCase() === user?.evaluatorId?.toLowerCase()
      );

      const realEvaluator: Evaluator = current || {
        id: user?.evaluatorId || user?.id || 'usr-eval-1',
        name: user?.name || 'Nandu',
        email: user?.email || 'nandulavanuru@gmail.com',
        designation: 'Jury Evaluator',
        organization: 'KARE',
        expertise: ['Full-Stack', 'AI/ML', 'System Design'],
        assignedTeamIds: [],
        assignedRounds: [1, 2, 3],
        completedCount: 0,
        pendingCount: 0,
        status: 'ACTIVE',
      };

      setEvaluator(realEvaluator);

      // Filter ONLY teams assigned to this evaluator
      const assigned = allTeams.filter((t) => realEvaluator.assignedTeamIds.includes(t.id));
      setAssignedTeams(assigned);

      const active = allRounds.find((r) => r.status === 'ACTIVE') || null;
      setActiveRound(active);
      setProblems(new Map(allProblems.map((p) => [p.id, p.title])));
    } finally {
      setLoading(false);
    }
  };

  if (loading || !evaluator) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-2 font-mono">Loading evaluator jury docket...</p>
      </div>
    );
  }

  const roundNum = activeRound?.number || activeRound?.id || 1;
  const completedCount = assignedTeams.filter((t) => t.roundScores?.[roundNum] !== undefined).length;
  const pendingCount = assignedTeams.length - completedCount;

  const scores = assignedTeams
    .map((t) => t.roundScores?.[roundNum])
    .filter((s): s is number => s !== undefined);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Evaluator Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1E2E]/90 border border-emerald-500/25 shadow-xl shadow-black/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={evaluator.avatarUrl}
            name={evaluator.name}
            size="xl"
            className="ring-3 ring-emerald-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">{evaluator.name}</h1>
              <Badge variant="gfg" size="sm">
                JURY PANEL
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {evaluator.designation} • {evaluator.organization}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {evaluator.expertise.map((exp, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 bg-[#0B1520] border border-emerald-500/30 text-emerald-300 rounded"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0B1520] p-3.5 rounded-xl border border-emerald-500/20 text-right">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Evaluation Round</span>
          {activeRound ? (
            <>
              <span className="text-sm font-bold text-white block mt-0.5">
                Round {activeRound.number || activeRound.id}: {activeRound.title || activeRound.name}
              </span>
              <Badge variant="gfg" size="sm" className="mt-1">
                WINDOW OPEN
              </Badge>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-slate-300 block mt-0.5">
                No Active Round
              </span>
              <Badge variant="amber" size="sm" className="mt-1">
                ALL UPCOMING / PAUSED
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Evaluator KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Teams"
          value={assignedTeams.length}
          subtitle="Allocated to your jury docket"
          icon={<Users className="w-5 h-5 text-[#22C55E]" />}
        />
        <StatCard
          title="Pending Evaluations"
          value={pendingCount}
          subtitle="Awaiting scoring & rubric"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          highlight={pendingCount > 0}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Submitted to master leaderboard"
          icon={<CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
        />
        <StatCard
          title="Average Score"
          value={avgScore > 0 ? `${avgScore}/100` : '—'}
          subtitle="Across your evaluations"
          icon={<Award className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      {/* Evaluator Teams Workload Table */}
      <div className="bg-[#0F1E2E]/90 border border-emerald-500/25 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
        <div className="p-4 border-b border-emerald-500/15 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Assigned Teams Queue ({assignedTeams.length} Teams)
            </h2>
            <p className="text-[11px] text-slate-400">
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
              <tr className="border-b border-emerald-500/15 bg-[#0B1520] text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Squad Name & College</th>
                <th className="py-3 px-4 hidden md:table-cell">Assigned Problem</th>
                <th className="py-3 px-4 text-center">Round</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-xs">
              {assignedTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    No teams currently assigned to your queue.
                  </td>
                </tr>
              ) : (
                assignedTeams.map((t) => {
                  const hasEvaluated = t.roundScores?.[roundNum] !== undefined;
                  const probTitle = t.problemStatementId ? problems.get(t.problemStatementId) : 'Problem Pending';

                  return (
                    <tr key={t.id} className="hover:bg-[#13273B] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={t.photoUrl} name={t.name} size="sm" />
                          <div>
                            <span className="font-bold text-white block">{t.name}</span>
                            <span className="text-[11px] text-slate-400">
                              {t.college} • <span className="font-mono text-emerald-400">{t.id}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 hidden md:table-cell text-slate-300 max-w-xs truncate">
                        <span className="font-mono text-[11px] text-cyan-400 block">
                          {t.problemStatementId || 'N/A'}
                        </span>
                        <span className="truncate block">{probTitle}</span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-slate-300">
                        {activeRound ? `Round ${activeRound.number || activeRound.id}` : '—'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {hasEvaluated ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#22C55E] bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.roundScores[roundNum]}/100
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
