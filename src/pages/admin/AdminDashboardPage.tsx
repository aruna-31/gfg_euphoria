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
  PieChart,
  Pie,
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
        <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 mt-2 font-mono">Loading operations command center...</p>
      </div>
    );
  }

  const COLORS = ['#00b259', '#38bdf8', '#fbbf24', '#c084fc', '#f87171', '#34d399', '#f472b6'];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner with Quick Actions */}
      <div className="relative overflow-hidden p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#13251a] via-[#0d1811] to-[#08100b] border border-[#2d5136] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,117,0.13),transparent_65%)] pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#71d895]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e575] animate-live-dot" /> Operations telemetry
              </span>
              <Badge variant="green" size="sm">ROUND 2 LIVE</Badge>
            </div>
            <h1 className="max-w-3xl text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em] text-white break-words">Operations Command Center</h1>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Real-time control tower for GFG Euphoria. Monitor participant onboarding, CSV batch pipelines, evaluator queues, and score distributions.
          </p>
          </div>

        <div className="relative flex w-full lg:w-auto flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/import')}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#00e575]" />}
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
      </div>

      {/* Primary KPI Grid (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Teams"
          value={metrics.totalTeams}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Participants"
          value={metrics.totalParticipants}
          icon={<UserCheck className="w-4 h-4 text-sky-400" />}
        />
        <StatCard
          title="Evaluators"
          value={metrics.totalEvaluators}
          icon={<ShieldCheck className="w-4 h-4 text-purple-400" />}
        />
        <StatCard
          title="Active Round"
          value={`R${metrics.activeRoundNumber}`}
          subtitle="Mid-Checkpoint"
          icon={<Clock className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          title="Evaluations"
          value={`${metrics.evaluationsCompleted}/${metrics.evaluationsCompleted + metrics.evaluationsPending}`}
          icon={<CheckCircle2 className="w-4 h-4 text-[#00e575]" />}
        />
        <StatCard
          title="Avg Score"
          value={`${metrics.averageScore}`}
          subtitle="Out of 200"
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* Analytics & Real-Time Pulse Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Challenge Track Distribution Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-200">
                Team Distribution Across Challenge Tracks
              </h2>
              <p className="text-[11px] text-gray-400">Number of teams allocated per domain</p>
            </div>
            <span className="text-xs font-mono text-[#00e575]">
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
                  stroke="#4b5563"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c130f',
                    borderColor: '#1e2e23',
                    borderRadius: '8px',
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
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#1b2b20] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00e575]" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  Live Event Activity Stream
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00e575] animate-pulse" />
            </div>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {activities.map((act) => (
                <div key={act.id} className="text-xs flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00b259] shrink-0 mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-200 font-semibold leading-tight">{act.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{act.description}</p>
                    <span className="text-[10px] font-mono text-gray-500 mt-0.5 block">
                      {act.timestamp} • by {act.actorName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1a2b20] mt-3">
            <button
              onClick={() => navigate('/admin/teams')}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-[#00e575] hover:text-white transition-colors"
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
