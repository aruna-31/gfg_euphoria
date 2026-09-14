import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { evaluatorService } from '../../services/evaluatorService';
import { teamService } from '../../services/teamService';
import { roundService } from '../../services/roundService';
import { problemService } from '../../services/problemService';
import { Team, Round, Evaluator } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Search, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const EvaluatorTeamsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [problems, setProblems] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      setTeams([]);
      setActiveRound(null);
      setProblems(new Map());
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((t) => {
    const hasEvaluated = t.roundScores?.[activeRound?.number || 2] !== undefined;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'COMPLETED' && hasEvaluated) ||
      (statusFilter === 'PENDING' && !hasEvaluated);

    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.college.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Assigned Evaluation Docket</h1>
          <p className="text-xs text-gray-400 mt-1">
            Review assigned hackathon teams for Round {activeRound?.number}: {activeRound?.name}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team..."
              className="bg-[#090e0b] border border-[#1b2b20] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#090e0b] border border-[#1b2b20] rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00b259]"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Only</option>
            <option value="COMPLETED">Scored Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((t) => {
          const hasEvaluated = t.roundScores?.[activeRound?.number || 2] !== undefined;
          const probTitle = t.problemStatementId ? problems.get(t.problemStatementId) : 'No problem selected';

          return (
            <Card key={t.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={t.photoUrl} name={t.name} size="md" />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">{t.name}</h3>
                      <p className="text-xs text-gray-400">{t.college}</p>
                    </div>
                  </div>
                  <Badge variant={hasEvaluated ? 'green' : 'amber'} size="sm">
                    {hasEvaluated ? 'EVALUATED' : 'PENDING'}
                  </Badge>
                </div>

                <div className="p-3 bg-[#080d0a] rounded-xl border border-[#17251c] space-y-1 mb-4 text-xs">
                  <span className="text-[10px] font-mono text-[#00e575] block">
                    {t.problemStatementId || 'TRACK PENDING'}
                  </span>
                  <p className="text-gray-200 line-clamp-2">{probTitle}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#17251c] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">
                    Round {activeRound?.number || '-'} Score
                  </span>
                  <span className="text-base font-mono font-bold text-[#00e575]">
                    {hasEvaluated ? `${t.roundScores[activeRound?.number || 2]} / 100` : 'Not evaluated yet'}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={hasEvaluated ? 'secondary' : 'primary'}
                  onClick={() => navigate(`/evaluator/evaluate/${t.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {hasEvaluated ? 'Edit Marks' : 'Evaluate'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
