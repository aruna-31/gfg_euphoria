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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1611] via-[#111f15] to-[#0a100d] border border-[#203627] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Hackodessey 4.0 Administration</h1>
            <Badge variant="green" size="sm">
              NO LIVE DATA
            </Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Live records will appear here after teams, evaluator profiles, assignments, and evaluations are imported.
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
          subtitle={metrics.activeRoundName}
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
          subtitle="No evaluations yet"
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
                  Recent Activity
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
                      {act.timestamp} â€¢ by {act.actorName}
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
