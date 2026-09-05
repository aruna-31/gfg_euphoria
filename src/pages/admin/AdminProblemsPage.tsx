import React, { useEffect, useState } from 'react';
import { problemService } from '../../services/problemService';
import { ProblemStatement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileCode2, Search, Users, ExternalLink } from 'lucide-react';

export const AdminProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const data = await problemService.getAllProblems();
      setProblems(data);
    } finally {
      setLoading(false);
    }
  };

  const filtered = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b20] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Problem Statement Bank</h1>
            <Badge variant="green" size="sm">
              {problems.length} TRACKS
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Monitor track quotas, maximum capacities, and student selection distribution.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or track..."
            className="w-full bg-[#080d0a] border border-[#1b2b20] rounded-lg pl-9 pr-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prob) => {
          const fillPercentage = Math.round((prob.selectedByCount / prob.maxCapacity) * 100);

          return (
            <Card key={prob.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="green" size="sm">
                    {prob.id}
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-400">
                    {prob.selectedByCount} / {prob.maxCapacity} Teams
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00e575]">
                  {prob.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">{prob.title}</h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3">{prob.shortDescription}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#17251c] space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>Capacity Utilization</span>
                  <span className={fillPercentage >= 80 ? 'text-amber-400' : 'text-[#00e575]'}>
                    {fillPercentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#142017] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00b259] rounded-full"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
