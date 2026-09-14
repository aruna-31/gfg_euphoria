import React, { useEffect, useState } from 'react';
import { teamService } from '../../services/teamService';
import { Participant, Team } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { UserCheck, Search, Crown, Building, Mail } from 'lucide-react';

export const AdminParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<(Participant & { teamName: string })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const teams = await teamService.getAllTeams();
      const list: (Participant & { teamName: string })[] = [];

      teams.forEach((t) => {
        (t.members || []).forEach((m) => {
          list.push({ ...m, teamName: t.name });
        });
      });

      setParticipants(list);
    } finally {
      setLoading(false);
    }
  };

  const filtered = participants.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Participants Master Registry</h1>
            <Badge variant="green" size="sm">
              {participants.length} REGISTERED STUDENTS
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete participant roster across all colleges and teams.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search participant, email, team..."
            className="w-full bg-[#080d0a] border border-[#1b2b20] rounded-lg pl-9 pr-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
          />
        </div>
      </div>

      <div className="bg-[#090e0b] border border-[#1a2b20] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#070b09] border-b border-[#17251c] text-[11px] font-mono text-gray-400 uppercase">
              <tr>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Team & College</th>
                <th className="py-3 px-3">Role In Team</th>
                <th className="py-3 px-3 text-center">Identity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132017]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#0e1611] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.name} size="sm" />
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-gray-300">{p.email}</td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-200 block">{p.teamName}</span>
                    <span className="text-[11px] text-gray-400">{p.college}</span>
                  </td>

                  <td className="py-3 px-3 text-gray-300">{p.roleInTeam || 'Member'}</td>

                  <td className="py-3 px-3 text-center">
                    {p.isLeader ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                        <Crown className="w-3 h-3" /> LEADER LOGIN
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-500 bg-[#101913] px-2 py-0.5 rounded">
                        MEMBER
                      </span>
                    )}
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
