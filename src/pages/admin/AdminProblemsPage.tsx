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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900">Problem Statement Bank</h1>
            <Badge variant="pink" size="sm">
              {problems.length} CHALLENGES
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Monitor track quotas, maximum capacities (3 teams max), and student selection distribution.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or track..."
            className="w-full bg-[#FAF8FA] border border-pink-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prob) => {
          const count = prob.selectedByCount || 0;
          const max = prob.maxCapacity || 3;
          const fillPercentage = Math.min(100, Math.round((count / max) * 100));

          return (
            <Card key={prob.id} className="p-5 flex flex-col justify-between bg-white border-pink-200 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="pink" size="sm">
                    {prob.id}
                  </Badge>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    count >= 3
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : count > 0
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {count} / {max} Teams
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-700 font-bold">
                  {prob.category}
                </span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 leading-snug">{prob.title}</h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{prob.shortDescription}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-100 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-gray-600">
                  <span>Capacity (3 Teams Max)</span>
                  <span className={count >= 3 ? 'text-red-600 font-bold' : 'text-pink-600 font-bold'}>
                    {count >= 3 ? 'FULL (3/3)' : `${count}/3 Taken`}
                  </span>
                </div>
                <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      count >= 3 ? 'bg-red-500' : 'bg-gradient-to-r from-pink-400 to-pink-600'
                    }`}
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
