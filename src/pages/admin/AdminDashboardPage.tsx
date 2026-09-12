import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, AdminMetrics } from '../../services/adminService';
import { ActivityFeedItem } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  DownloadCloud,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [probDistribution, setProbDistribution] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [m, acts, dist] = await Promise.all([
        adminService.getMetrics(),
        adminService.getActivities(),
        adminService.getProblemDistribution(),
      ]);
      setMetrics(m);
      setActivities(acts);
      setProbDistribution(dist);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-2 font-mono">Loading operations command center...</p>
      </div>
    );
  }

  const COLORS = ['#22C55E', '#10B981', '#06B6D4', '#F59E0B', '#3B82F6', '#14B8A6'];

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Banner with Quick Actions */}
      <div className="p-6 rounded-2xl bg-[#0F1E2E]/90 border border-emerald-500/25 shadow-xl shadow-black/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Hackodessey 4.0 Administration</h1>
            <Badge variant="gfg" size="sm">
              LIVE HUB
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Centralized hackathon directorate for managing squads, evaluator assignments, problem capacity locks, and marksheets.
          </p>
        </div>

        <div className="relative flex w-full lg:w-auto flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/import')}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#22C55E]" />}
          >
            Import CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/admin/reports')}
            leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
          >
            Export Marksheet
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Teams"
          value={metrics.totalTeams}
          icon={<Users className="w-4 h-4 text-[#22C55E]" />}
        />
        <StatCard
          title="Participants"
          value={metrics.totalParticipants}
          icon={<UserCheck className="w-4 h-4 text-cyan-400" />}
        />
        <StatCard
          title="Evaluators"
          value={metrics.totalEvaluators}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          title="Active Round"
          value={`R${metrics.activeRoundNumber}`}
          subtitle={metrics.activeRoundName}
          icon={<Clock className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          title="Evaluations"
          value={`${metrics.evaluationsCompleted}/${metrics.evaluationsCompleted + metrics.evaluationsPending}`}
          icon={<CheckCircle2 className="w-4 h-4 text-[#22C55E]" />}
        />
        <StatCard
          title="Avg Score"
          value={`${metrics.averageScore}`}
          subtitle="All rounds"
          icon={<TrendingUp className="w-4 h-4 text-teal-400" />}
        />
      </div>

      {/* Analytics & Real-Time Pulse Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Challenge Track Distribution Chart */}
        <Card className="lg:col-span-2 p-5 bg-[#0F1E2E]/90 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                Team Distribution Across Challenge Tracks
              </h2>
              <p className="text-[11px] text-slate-400">Number of teams allocated per track</p>
            </div>
            <span className="text-xs font-mono text-[#22C55E] font-bold">
              {probDistribution.reduce((a, b) => a + b.value, 0)} Teams Assigned
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={probDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1E2E',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {probDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Real-time Hackathon Activity Feed */}
        <Card className="p-5 flex flex-col justify-between bg-[#0F1E2E]/90 border border-emerald-500/20">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#22C55E]" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  Recent Activity
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            </div>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {activities.map((act) => (
                <div key={act.id} className="text-xs flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0 mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-200 font-semibold leading-tight">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{act.description}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
                      {act.timestamp} • by {act.actorName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/60 mt-3">
            <button
              onClick={() => navigate('/admin/teams')}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-[#22C55E] hover:text-white transition-colors cursor-pointer"
            >
              <span>Manage Teams Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
