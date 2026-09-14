import React, { useEffect, useState } from 'react';
import { problemService } from '../../services/problemService';
import { ProblemStatement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, RefreshCw, Users, Clock, Building2, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const AdminProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  useEffect(() => {
    loadProblems();
    // Live update poll every 10 seconds for real-time selection monitoring
    const interval = setInterval(() => {
      loadProblems(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadProblems = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await problemService.getAllProblems();
      setProblems(data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const filtered = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.selectedTeams && p.selectedTeams.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.college.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const totalCapacity = problems.length * 3;
  const totalAllocated = problems.reduce((acc, p) => acc + (p.selectedByCount || 0), 0);
  const fullProblemsCount = problems.filter((p) => (p.selectedByCount || 0) >= 3).length;

  const toggleExpand = (id: string) => {
    setExpandedProblemId(prev => prev === id ? null : id);
  };

  const formatTime = (iso?: string) => {
    if (!iso) return 'Just now';
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Problem Statement Management</h1>
            <Badge variant="gfg" size="sm">
              {problems.length} CHALLENGES
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time track monitoring, live team allocations (strict 3 teams max), and squad selection timestamps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem, team, or college..."
              className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadProblems(true)}
            isLoading={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0F1E2E]/80 border border-emerald-500/20">
          <p className="text-[10px] font-mono uppercase text-slate-400">Total Statements</p>
          <p className="text-xl font-black text-white mt-1">{problems.length}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0F1E2E]/80 border border-emerald-500/20">
          <p className="text-[10px] font-mono uppercase text-slate-400">Total Capacity</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{totalCapacity} <span className="text-xs font-normal text-slate-400">Slots</span></p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0F1E2E]/80 border border-cyan-500/20">
          <p className="text-[10px] font-mono uppercase text-slate-400">Allocated Teams</p>
          <p className="text-xl font-black text-cyan-400 mt-1">{totalAllocated} <span className="text-xs font-normal text-slate-400">Locked</span></p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0F1E2E]/80 border border-amber-500/20">
          <p className="text-[10px] font-mono uppercase text-slate-400">Full Statements (3/3)</p>
          <p className="text-xl font-black text-amber-400 mt-1">{fullProblemsCount} <span className="text-xs font-normal text-slate-400">Closed</span></p>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prob) => {
          const count = prob.selectedByCount || 0;
          const max = prob.maxCapacity || 3;
          const fillPercentage = Math.min(100, Math.round((count / max) * 100));
          const isExpanded = expandedProblemId === prob.id;
          const selectedTeams = prob.selectedTeams || [];

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
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">{prob.shortDescription}</p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Capacity</span>
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

                {/* Selected Teams Section */}
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => toggleExpand(prob.id)}
                    className="w-full flex items-center justify-between text-[11px] font-mono text-emerald-300 hover:text-emerald-200 transition-colors py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Assigned Squads ({selectedTeams.length})
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Expanded Selected Teams List */}
                  {isExpanded && (
                    <div className="mt-2 space-y-2 bg-[#0A111A]/90 p-2.5 rounded-xl border border-emerald-500/20 text-xs">
                      {selectedTeams.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic py-1">No squad has locked this challenge yet.</p>
                      ) : (
                        selectedTeams.map((t, idx) => (
                          <div key={t.id || idx} className="p-2 rounded-lg bg-[#0F1E2E] border border-slate-700/50 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-[11px]">{t.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                {t.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="truncate">{t.college}</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                              <span>Leader: {t.leaderEmail}</span>
                              <span className="flex items-center gap-0.5 text-emerald-400">
                                <Clock className="w-2.5 h-2.5" />
                                {formatTime(t.selectedAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
