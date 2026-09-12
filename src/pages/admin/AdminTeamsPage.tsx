import React, { useEffect, useState } from 'react';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { evaluationService } from '../../services/evaluationService';
import { Team } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  Eye,
  Building,
  Mail,
  Crown,
} from 'lucide-react';

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const [allTeams, allProblems] = await Promise.all([
        teamService.getAllTeams(),
        problemService.getAllProblems(),
      ]);
      setTeams(allTeams);
      setProblems(new Map(allProblems.map((p) => [p.id, p.title])));
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
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Teams Directory & Registry</h1>
            <Badge variant="gfg" size="sm">
              {teams.length} REGISTERED SQUADS
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse all verified participating teams, challenge allocations, squad photos, and scoring progress.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F1E2E]/90 p-3 rounded-xl border border-emerald-500/20 shadow-md">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team name, ID, or leader..."
            className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400">College:</span>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="bg-[#0B1520] border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
      <div className="bg-[#0F1E2E]/90 border border-emerald-500/25 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#0B1520] border-b border-emerald-500/15 text-[11px] font-mono text-slate-400 uppercase">
              <tr>
                <th className="py-3.5 px-4">Squad & College</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Leader & Email</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Selected Problem Statement</th>
                <th className="py-3.5 px-3 text-center">Score</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-[#13273B] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={team.photoUrl} name={team.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{team.name}</span>
                          <Badge variant="gfg" size="sm">
                            {team.id}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {team.college}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="text-white block font-medium">{team.leaderName}</span>
                    <span className="font-mono text-[11px] text-emerald-400">{team.leaderEmail}</span>
                  </td>

                  <td className="py-3.5 px-4 hidden sm:table-cell max-w-xs truncate text-slate-300">
                    {team.problemStatementId ? (
                      <div>
                        <span className="font-mono font-bold text-[11px] text-cyan-400 block">
                          {team.problemStatementId}
                        </span>
                        <span className="truncate block text-slate-200 font-medium">
                          {problems.get(team.problemStatementId) || 'Challenge Locked'}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-mono">
                        NOT SELECTED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-black text-[#22C55E]">
                    {team.totalScore}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <Badge variant={team.photoUrl ? 'gfg' : 'amber'} size="sm">
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
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B1520] border border-emerald-500/20">
              <Avatar
                src={selectedTeam.photoUrl}
                name={selectedTeam.name}
                size="xl"
                className="ring-2 ring-emerald-500/40"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white">{selectedTeam.name}</h3>
                <p className="text-xs text-slate-400">{selectedTeam.college}</p>
                <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="text-[#22C55E] font-bold">Rank #{selectedTeam.rank || 1}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-white font-bold">{selectedTeam.totalScore} Points</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">Leader: {selectedTeam.leaderName}</span>
                </div>
              </div>
            </div>

            {/* Member Roster */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono mb-2 text-emerald-400">
                Squad Member Composition ({selectedTeam.members?.length || 4} Registered)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTeam.members?.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#0B1520] rounded-xl border border-slate-700/60 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">{m.name}</span>
                      {m.isLeader && (
                        <span className="text-[10px] bg-[#22C55E] text-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">
                          LEADER
                        </span>
                      )}
                    </div>
                    {m.isLeader && m.email && (
                      <p className="text-[11px] font-mono text-slate-400 truncate">{m.email}</p>
                    )}
                    <p className="text-[10px] text-emerald-400 font-medium">{m.roleInTeam}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement Details */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono mb-1.5 text-cyan-400">
                Selected Problem Statement
              </h4>
              <div className="p-3 bg-[#0B1520] rounded-xl border border-emerald-500/20">
                <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                  {selectedTeam.problemStatementId || 'UNSELECTED'}
                </span>
                <p className="text-xs font-bold text-white mt-0.5">
                  {selectedTeam.problemStatementId
                    ? problems.get(selectedTeam.problemStatementId) || 'Locked Challenge'
                    : 'Team has not selected or locked a problem statement yet.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex justify-end">
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
