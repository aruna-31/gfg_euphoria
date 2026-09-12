import React, { useEffect, useState } from 'react';
import { problemService } from '../../services/problemService';
import { ProblemStatement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search } from 'lucide-react';

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
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Problem Statement Repository</h1>
            <Badge variant="gfg" size="sm">
              {problems.length} CHALLENGES
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor track quotas, live selection slots (strict 3 teams max), and distribution across teams.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or tracks..."
            className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prob) => {
          const count = prob.selectedByCount || 0;
          const max = prob.maxCapacity || 3;
          const fillPercentage = Math.min(100, Math.round((count / max) * 100));

          return (
            <Card key={prob.id} className="p-5 flex flex-col justify-between bg-[#0F1E2E]/90 border border-emerald-500/20 shadow-xl shadow-black/40">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="gfg" size="sm">
                    {prob.id}
                  </Badge>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    count >= 3
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      : count > 0
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {count} / {max} Teams Selected
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {prob.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">{prob.title}</h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3">{prob.shortDescription}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Capacity (3 Teams Max)</span>
                  <span className={count >= 3 ? 'text-rose-400 font-bold' : 'text-[#22C55E] font-bold'}>
                    {count >= 3 ? 'FULL (3/3 Teams)' : `${count}/3 Allocated`}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      count >= 3 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#2F8D46] to-[#22C55E]'
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
