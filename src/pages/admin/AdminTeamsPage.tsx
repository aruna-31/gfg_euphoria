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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Teams Directory & Registry</h1>
            <Badge variant="green" size="sm">
              {teams.length} REGISTERED TEAMS
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Browse all verified teams, evaluate status, inspection drawer, and college affiliations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a0f0c] p-3 rounded-xl border border-[#1b2b20]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team name, ID, or leader..."
            className="w-full bg-[#080d0a] border border-[#1b2b20] rounded-lg pl-9 pr-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-gray-400">College:</span>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="bg-[#080d0a] border border-[#1b2b20] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#00b259]"
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
      <div className="bg-[#090e0b] border border-[#1a2b20] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#070b09] border-b border-[#17251c] text-[11px] font-mono text-gray-400 uppercase">
              <tr>
                <th className="py-3 px-4">Team & College</th>
                <th className="py-3 px-4 hidden md:table-cell">Leader & Email</th>
                <th className="py-3 px-4 hidden sm:table-cell">Problem Track</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3 text-center hidden lg:table-cell">Evaluations</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132017]">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-[#0e1611] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={team.photoUrl} name={team.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{team.name}</span>
                          <Badge variant="green" size="sm">
                            {team.id}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-gray-400 truncate block">
                          {team.college}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-200 block font-medium">{team.leaderName}</span>
                    <span className="font-mono text-[11px] text-gray-400">{team.leaderEmail}</span>
                  </td>

                  <td className="py-3 px-4 hidden sm:table-cell max-w-xs truncate text-gray-300">
                    <span className="font-mono text-[10px] text-[#00e575] block">
                      {team.problemStatementId || 'UNSELECTED'}
                    </span>
                    <span className="truncate">
                      {team.problemStatementId ? problems.get(team.problemStatementId) : 'No problem selected'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-[#00e575]">
                    {team.totalScore}
                  </td>

                  <td className="py-3 px-3 text-center hidden lg:table-cell">
                    <span className="font-mono text-[11px] text-sky-300">
                      {[1, 2, 3].filter((round) => evaluationStatus.get(team.id)?.has(round)).length} / 3 rounds
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <Badge variant={team.photoUrl ? 'green' : 'amber'} size="sm">
                      {team.status.replace('_', ' ')}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
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
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#080d0a] border border-[#1b2b20]">
              <Avatar
                src={selectedTeam.photoUrl}
                name={selectedTeam.name}
                size="xl"
                className="ring-2 ring-[#00b259]/40"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white">{selectedTeam.name}</h3>
                <p className="text-xs text-gray-400">{selectedTeam.college}</p>
                <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="text-[#00e575]">Rank #{selectedTeam.rank || '-'}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-white">{selectedTeam.totalScore} Points</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sky-400">Round 1: {selectedTeam.roundScores[1] || '—'}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-amber-400">Round 2: {selectedTeam.roundScores[2] || '—'}</span>
                </div>
              </div>
            </div>

            {/* Member Roster */}
            <div>
              <h4 className="font-bold text-gray-200 text-xs uppercase tracking-wider font-mono mb-2">
                Team Member Composition ({selectedTeam.members.length} Registered)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTeam.members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">{m.name}</span>
                      {m.isLeader && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                          LEADER
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-gray-400 truncate">{m.email}</p>
                    <p className="text-[10px] text-[#00e575]">{m.roleInTeam}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement Details */}
            <div>
              <h4 className="font-bold text-gray-200 text-xs uppercase tracking-wider font-mono mb-1.5">
                Selected Challenge Track
              </h4>
              <div className="p-3 bg-[#080d0a] rounded-xl border border-[#1b2b20]">
                <span className="text-[10px] font-mono text-[#00e575] block">
                  {selectedTeam.problemStatementId || 'UNSELECTED'}
                </span>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {selectedTeam.problemStatementId
                    ? problems.get(selectedTeam.problemStatementId)
                    : 'Team has not locked a problem statement yet.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b2b20] flex justify-end">
              <Button variant="ghost" onClick={() => setSelectedTeam(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
