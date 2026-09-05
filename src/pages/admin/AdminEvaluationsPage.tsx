import React, { useEffect, useState } from 'react';
import { evaluationService } from '../../services/evaluationService';
import { teamService } from '../../services/teamService';
import { evaluatorService } from '../../services/evaluatorService';
import { Evaluation, Team, Evaluator } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ClipboardCheck, Search } from 'lucide-react';

export const AdminEvaluationsPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [teams, setTeams] = useState<Map<string, Team>>(new Map());
  const [evaluators, setEvaluators] = useState<Map<string, Evaluator>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evals, allTeams, allEvaluators] = await Promise.all([
        evaluationService.getAllEvaluations(),
        teamService.getAllTeams(),
        evaluatorService.getAllEvaluators(),
      ]);
      setEvaluations(evals);
      setTeams(new Map(allTeams.map((t) => [t.id, t])));
      setEvaluators(new Map(allEvaluators.map((e) => [e.id, e])));
    } finally {
      setLoading(false);
    }
  };

  const filtered = evaluations.filter((ev) => {
    const t = teams.get(ev.teamId);
    const teamName = t?.name || '';
    return (
      teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.teamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.feedback.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Master Evaluation Matrix</h1>
            <Badge variant="green" size="sm">
              {evaluations.length} RECORDED
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Audit score submissions, jury remarks, and timestamp logs across all rounds.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evaluation records..."
            className="w-full bg-[#080d0a] border border-[#1b2b20] rounded-lg pl-9 pr-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
          />
        </div>
      </div>

      <div className="bg-[#090e0b] border border-[#1a2b20] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#070b09] border-b border-[#17251c] text-[11px] font-mono text-gray-400 uppercase">
              <tr>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Round</th>
                <th className="py-3 px-4">Evaluator</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-4">Qualitative Feedback</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132017]">
              {filtered.map((ev) => {
                const team = teams.get(ev.teamId);
                const evalObj = evaluators.get(ev.evaluatorId);

                return (
                  <tr key={ev.id} className="hover:bg-[#0e1611] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {team?.name || ev.teamId}
                      <span className="text-[11px] font-mono text-gray-400 block">{ev.teamId}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#00e575]">Round {ev.roundId}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {evalObj?.name || ev.evaluatorId}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#00e575]">
                      {ev.totalScore} / 100
                    </td>
                    <td className="py-3 px-4 max-w-sm truncate text-gray-400 italic">
                      "{ev.feedback}"
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-gray-500">
                      {new Date(ev.submittedAt || ev.evaluatedAt || Date.now()).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
