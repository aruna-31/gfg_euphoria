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
    </div>
  );
};
