import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { roundService } from '../../services/roundService';
import { teamService } from '../../services/teamService';
import { evaluationService } from '../../services/evaluationService';
import { Round, Team, Evaluation } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const RoundStatusPage: React.FC = () => {
  const { user } = useAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roundsData, teamData] = await Promise.all([
        roundService.getAllRounds(),
        teamService.getTeamById(user?.teamId || 'TEAM-001'),
      ]);
      setRounds(roundsData);
      setTeam(teamData);

      if (teamData) {
        const evals = await evaluationService.getEvaluationsByTeam(teamData.id);
        setEvaluations(evals);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="green" size="sm">COMPLETED</Badge>;
      case 'ACTIVE':
        return <Badge variant="blue" size="sm">IN PROGRESS</Badge>;
      default:
        return <Badge variant="gray" size="sm">UPCOMING</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 mt-2 font-mono">Loading round telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1b2b20] pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white">Round Timeline & Evaluation Status</h1>
          <Badge variant="green" size="sm">3 OFFICIAL ROUNDS</Badge>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Detailed breakdown of checkpoint timelines, scores received, evaluator feedback, and preparation criteria.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-[#1c2e22] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
        {rounds.map((round) => {
          const roundScore = team?.roundScores?.[round.id];
          const roundEval = evaluations.find((e) => e.roundId === round.id);
          const isCurrentActive = round.status === 'ACTIVE';

          return (
            <div key={round.id} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-1 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  round.status === 'COMPLETED'
                    ? 'border-[#00b259] bg-[#0d2215] text-[#00e575]'
                    : isCurrentActive
                    ? 'border-[#00e575] bg-[#072414] text-white animate-pulse'
                    : 'border-gray-700 bg-[#111] text-gray-500'
                }`}
              >
                {round.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00e575]" />
                ) : isCurrentActive ? (
                  <Clock className="w-4 h-4 text-[#00e575]" />
                ) : (
                  <span className="text-xs font-mono">{round.id}</span>
                )}
              </div>

              {/* Round Card Container */}
              <Card className={`p-6 ${isCurrentActive ? 'border-[#00b259]/50 shadow-lg shadow-[#00b259]/10' : ''}`}>
                {/* Round Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#1b2b20]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-[#00e575]">
                        STAGE {round.id}
                      </span>
                      {getStatusBadge(round.status)}
                    </div>
                    <h2 className="text-lg font-bold text-white">{round.title}</h2>
                  </div>

                  {roundScore !== undefined && (
                    <div className="flex items-center gap-2 bg-[#09150d] px-3.5 py-2 rounded-xl border border-[#1b3824]">
                      <Award className="w-5 h-5 text-[#00e575]" />
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 block uppercase">
                          Score Achieved
                        </span>
                        <span className="text-base font-mono font-bold text-[#00e575]">
                          {roundScore} <span className="text-xs text-gray-500 font-normal">/ {round.maxScore}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  {round.description}
                </p>

                {/* Dates & Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-3.5 bg-[#060a08] rounded-xl border border-[#152319] space-y-2">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#00e575]" />
                      Checkpoint Schedule
                    </span>
                    <div className="text-xs space-y-1 font-mono">
                      <p className="text-gray-400">
                        Start: <span className="text-white">{new Date(round.startTime).toLocaleString()}</span>
                      </p>
                      <p className="text-gray-400">
                        Lock: <span className="text-white">{new Date(round.endTime).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#060a08] rounded-xl border border-[#152319] space-y-2">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#00e575]" />
                      Milestone Instructions
                    </span>
                    <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                      {round.instructions.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Rubric Criteria */}
                <div className="border-t border-[#1b2b20] pt-4">
                  <h3 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Evaluation Rubric Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {round.criteria.map((crit) => (
                      <div
                        key={crit.id}
                        className="p-2.5 rounded-lg bg-[#0b120d] border border-[#18261c] flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-300 truncate mr-2">{crit.title || crit.name}</span>
                        <span className="text-xs font-mono font-bold text-[#00e575]">
                          Max {crit.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                    Checkpoint Deliverables & Instructions
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 bg-[#090e0b] p-3 rounded-xl border border-[#18261c]">
                    {round.instructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                </div>

                {/* Evaluator Feedback Preview if present */}
                {roundEval && (
                  <div className="p-3.5 rounded-xl bg-[#0e1a12] border border-[#203627] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#00e575]" />
                        Official Evaluator Notes & Feedback
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(roundEval.submittedAt || roundEval.evaluatedAt || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 italic">"{roundEval.feedback}"</p>
                    {roundEval.strengths && (
                      <p className="text-[11px] text-emerald-300">
                        <strong>Key Strengths:</strong> {roundEval.strengths}
                      </p>
                    )}
                    {roundEval.improvements && (
                      <p className="text-[11px] text-amber-300">
                        <strong>Recommendations:</strong> {roundEval.improvements}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
