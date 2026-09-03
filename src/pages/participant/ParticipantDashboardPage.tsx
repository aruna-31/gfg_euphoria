import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { participantService, ScheduleEvent } from '../../services/participantService';
import { teamService } from '../../services/teamService';
import { Team, Announcement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import {
  Users,
  Calendar,
  Bell,
  Trophy,
  ArrowRight,
  Sparkles,
  Clock,
  FileCode2,
} from 'lucide-react';

export const ParticipantDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamData, sched, ann] = await Promise.all([
        participantService.getMyTeam(user?.teamId || 'TEAM-001'),
        participantService.getSchedule(),
        participantService.getAnnouncements(),
      ]);
      setTeam(teamData);
      setSchedule(sched);
      setAnnouncements(ann);
    } finally {
      setLoading(false);
    }
  };

  const nextEvent = schedule.find((e) => e.status === 'LIVE') || schedule.find((e) => e.status === 'UPCOMING');

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400 font-mono text-xs">
        Loading Participant Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="bg-[#0b120e] border border-[#162319] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0d1c26] border border-[#1d3345] text-[11px] font-mono text-blue-400 mb-2">
            <Users className="w-3 h-3" />
            <span>PARTICIPANT WORKSPACE • READ-ONLY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hello, {user?.name || 'Participant'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track your team's live standing, event schedule, and announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/participant/team')}
            className="px-4 py-2 rounded-xl bg-[#121c16] hover:bg-[#1a2b20] border border-[#1e3024] text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
          >
            My Team Info
          </button>
          <button
            onClick={() => navigate('/participant/leaderboard')}
            className="px-4 py-2 rounded-xl bg-[#00b259] hover:bg-[#00c964] text-black font-bold text-xs transition-colors cursor-pointer"
          >
            View Leaderboard
          </button>
        </div>
      </div>

      {/* 2. Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Team Snapshot */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-2.5">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
                Assigned Team
              </span>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {team?.id}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={team?.photoUrl}
                name={team?.name || 'Team'}
                size="md"
                className="ring-1 ring-[#1f3325]"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{team?.name}</h3>
                <p className="text-xs text-gray-400">{team?.college}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-300 bg-[#070a08] p-3 rounded-xl border border-[#141f17]">
              <div className="flex justify-between">
                <span className="text-gray-400">Team Leader:</span>
                <span className="font-semibold text-white">{team?.leaderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Score:</span>
                <span className="font-mono font-bold text-[#00e575]">{team?.totalScore} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Standing:</span>
                <span className="font-mono font-bold text-white">Rank #{team?.rank}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#142117] flex justify-end">
            <button
              onClick={() => navigate('/participant/team')}
              className="text-xs text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Team Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Current Round & Status */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-2.5">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
                Hackathon Progress
              </span>
              <Badge variant="green" size="sm">
                ROUND 2 ACTIVE
              </Badge>
            </div>

            <h3 className="text-sm font-bold text-white mb-1">Functional Prototype Defense</h3>
            <p className="text-xs text-gray-400 mb-3">
              Jury scoring is active. Teams must remain stationed at their allocated booths.
            </p>

            <div className="bg-[#070a08] p-3 rounded-xl border border-[#141f17] text-xs space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase block font-semibold">
                Challenge Track
              </span>
              <p className="font-semibold text-white">{team?.problemStatementId || 'Selection Confirmed'}</p>
              <p className="text-gray-400 text-[11px]">Submissions handled by Team Leader</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#142117] flex justify-between items-center text-xs">
            <span className="text-gray-400">Scores sync live</span>
            <button
              onClick={() => navigate('/participant/leaderboard')}
              className="text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Live Podium</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Next Live Schedule Item */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#142117] pb-2.5">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
                Current Agenda
              </span>
              {nextEvent?.status === 'LIVE' ? (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  LIVE NOW
                </span>
              ) : (
                <span className="text-[10px] font-mono text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded border border-gray-500/20">
                  UPCOMING
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-white mb-1">{nextEvent?.title}</h3>
            <p className="text-xs text-gray-400 mb-3">{nextEvent?.description}</p>

            <div className="bg-[#070a08] p-3 rounded-xl border border-[#141f17] text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Clock className="w-3 h-3 text-[#00e575]" />
                <span className="font-mono font-semibold">{nextEvent?.time}</span>
              </div>
              <p className="text-gray-400 text-[11px]">{nextEvent?.location}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#142117] flex justify-end">
            <button
              onClick={() => navigate('/participant/schedule')}
              className="text-xs text-[#00e575] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>
      </div>

      {/* 3. Announcements Feed */}
      <div className="bg-[#0b120e] border border-[#162319] rounded-2xl p-6 text-left">
        <div className="flex items-center justify-between mb-4 border-b border-[#142117] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Official Announcements
            </h2>
          </div>
          <button
            onClick={() => navigate('/participant/announcements')}
            className="text-xs font-mono text-[#00e575] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {announcements.slice(0, 2).map((ann) => (
            <div
              key={ann.id}
              className="p-3.5 rounded-xl bg-[#070a08] border border-[#142017] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {ann.category}
                  </span>
                  <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{ann.content}</p>
              </div>

              <span className="text-[11px] font-mono text-gray-500 shrink-0">
                {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
