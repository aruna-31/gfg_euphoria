import React, { useEffect, useState } from 'react';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { evaluationService } from '../../services/evaluationService';
import { Team, ProblemStatement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  Building,
  Mail,
  Crown,
  FileCode2,
} from 'lucide-react';

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluationStatus, setEvaluationStatus] = useState<Map<string, Set<number>>>(new Map());

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const [allTeams, allProblems, evaluations] = await Promise.all([
        teamService.getAllTeams(),
        problemService.getAllProblems(),
        evaluationService.getAllEvaluations(),
      ]);
      setTeams(allTeams);
      setProblems(new Map(allProblems.map((p) => [p.id, p.title])));
      const status = new Map<string, Set<number>>();
      evaluations.forEach((evaluation) => {
        const rounds = status.get(evaluation.teamId) || new Set<number>();
        rounds.add(evaluation.roundId);
        status.set(evaluation.teamId, rounds);
      });
      setEvaluationStatus(status);
    } finally {
      setLoading(false);
    }
  };

  const colleges = ['ALL', ...Array.from(new Set(teams.map((t) => t.college)))];

  const filteredTeams = teams.filter((t) => {
    const matchesCollege = collegeFilter === 'ALL' || t.college === collegeFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.leaderEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollege && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900">Teams Directory & Registry</h1>
            <Badge variant="pink" size="sm">
              {teams.length} REGISTERED TEAMS
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Browse all verified teams, problem statement allocations, squad photos, and scoring progress.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-pink-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team name, ID, or leader..."
            className="w-full bg-[#FAF8FA] border border-pink-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-gray-500">College:</span>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="bg-[#FAF8FA] border border-pink-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-pink-500"
          >
            {colleges.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teams Data Table */}
      <div className="bg-white border border-pink-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#FAF8FA] border-b border-pink-200 text-[11px] font-mono text-gray-600 uppercase">
              <tr>
                <th className="py-3.5 px-4">Team & College</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Leader & Email</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Selected Problem Statement</th>
                <th className="py-3.5 px-3 text-center">Score</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-pink-50/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={team.photoUrl} name={team.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{team.name}</span>
                          <Badge variant="pink" size="sm">
                            {team.id}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-gray-500 truncate block">
                          {team.college}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="text-gray-900 block font-medium">{team.leaderName}</span>
                    <span className="font-mono text-[11px] text-gray-500">{team.leaderEmail}</span>
                  </td>

                  <td className="py-3.5 px-4 hidden sm:table-cell max-w-xs truncate text-gray-700">
                    {team.problemStatementId ? (
                      <div>
                        <span className="font-mono font-bold text-[11px] text-pink-700 block">
                          {team.problemStatementId}
                        </span>
                        <span className="truncate block text-gray-800 font-medium">
                          {problems.get(team.problemStatementId) || 'Challenge Locked'}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono">
                        NOT SELECTED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-black text-pink-600">
                    {team.totalScore}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <Badge variant={team.photoUrl ? 'pink' : 'amber'} size="sm">
                      {team.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTeam(team)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Details Inspection Modal */}
      {selectedTeam && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTeam(null)}
          title={`${selectedTeam.id}: ${selectedTeam.name}`}
          description={`Institution: ${selectedTeam.college}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-left text-xs">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8FA] border border-pink-200">
              <Avatar
                src={selectedTeam.photoUrl}
                name={selectedTeam.name}
                size="xl"
                className="ring-2 ring-pink-300"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-900">{selectedTeam.name}</h3>
                <p className="text-xs text-gray-600">{selectedTeam.college}</p>
                <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="text-pink-700 font-bold">Rank #{selectedTeam.rank || 1}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-800 font-bold">{selectedTeam.totalScore} Points</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600">Leader: {selectedTeam.leaderName}</span>
                </div>
              </div>
            </div>

            {/* Member Roster (All 4 members) */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider font-mono mb-2">
                Team Member Composition ({selectedTeam.members?.length || 4} Registered)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTeam.members?.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#FAF8FA] rounded-xl border border-pink-100 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 truncate">{m.name}</span>
                      {m.isLeader && (
                        <span className="text-[10px] bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded font-mono font-bold border border-pink-200">
                          LEADER
                        </span>
                      )}
                    </div>
                    {m.isLeader && m.email && (
                      <p className="text-[11px] font-mono text-gray-500 truncate">{m.email}</p>
                    )}
                    <p className="text-[10px] text-pink-700 font-medium">{m.roleInTeam}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement Details */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider font-mono mb-1.5">
                Selected Problem Statement
              </h4>
              <div className="p-3 bg-[#FAF8FA] rounded-xl border border-pink-200">
                <span className="text-[10px] font-mono font-bold text-pink-700 block">
                  {selectedTeam.problemStatementId || 'UNSELECTED'}
                </span>
                <p className="text-xs font-bold text-gray-900 mt-0.5">
                  {selectedTeam.problemStatementId
                    ? problems.get(selectedTeam.problemStatementId) || 'Locked Challenge'
                    : 'Team has not selected or locked a problem statement yet.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-pink-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedTeam(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
