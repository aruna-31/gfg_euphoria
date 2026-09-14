import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { teamService } from '../../services/teamService';
import { problemService } from '../../services/problemService';
import { roundService } from '../../services/roundService';
import { evaluationService } from '../../services/evaluationService';
import { Team, ProblemStatement, Round, EvaluationCriterion } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileCode2,
  Send,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EvaluateTeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotification();
  const { playSubmission, playAlert } = useAudio();

  const [team, setTeam] = useState<Team | null>(null);
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  // Modals & submission state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [teamId]);

  const loadData = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const [teamData, roundData] = await Promise.all([
        teamService.getTeamById(teamId),
        roundService.getActiveRound(),
      ]);

      if (!teamData) {
        setLoading(false);
        return;
      }

      const active = roundData || {
        id: 1,
        number: 1,
        name: 'Round 1: Problem Definition & Prototype',
        title: 'Initial Milestone Review',
        description: 'Evaluate core architecture, system design, and functional prototype.',
        status: 'ACTIVE' as const,
        startTime: '',
        endTime: '',
        maxScore: 100,
        instructions: ['Review architecture', 'Test prototype live'],
        criteria: [
          { id: 'crit-1', title: 'Technical Innovation & Architecture', name: 'Technical Innovation & Architecture', maxScore: 30, description: 'Code structure, design pattern, and feasibility.' },
          { id: 'crit-2', title: 'UI / UX & Accessibility', name: 'UI / UX & Accessibility', maxScore: 25, description: 'Visual hierarchy, responsiveness, and usability.' },
          { id: 'crit-3', title: 'Completeness & Deliverables', name: 'Completeness & Deliverables', maxScore: 25, description: 'Adherence to stated challenge requirements.' },
          { id: 'crit-4', title: 'Presentation & Q&A Defense', name: 'Presentation & Q&A Defense', maxScore: 20, description: 'Clarity of jury defense and question handling.' },
        ],
      };

      setTeam(teamData);
      setRound(active);

      if (teamData.problemStatementId) {
        const prob = await problemService.getProblemById(teamData.problemStatementId);
        setProblem(prob);
      }

      // Check if existing evaluation exists
      const existing = await evaluationService.getEvaluationForEvaluatorAndRound(
        teamData.id,
        active.id,
        user?.evaluatorId || 'eval-1'
      );

      if (existing) {
        setScores(existing.scores);
        setFeedback(existing.feedback || '');
        setStrengths(existing.strengths || '');
        setImprovements(existing.improvements || '');
      } else {
        const initialScores: Record<string, number> = {};
        active.criteria.forEach((c) => {
          initialScores[c.id] = Math.round(c.maxScore * 0.85);
        });
        setScores(initialScores);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (critId: string, val: number, maxVal: number) => {
    const clamped = Math.max(0, Math.min(maxVal, isNaN(val) ? 0 : val));
    setScores((prev) => ({ ...prev, [critId]: clamped }));
  };

  const totalCalculatedScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const getTierLabel = (score: number) => {
    if (score >= 90) return { label: 'OUTSTANDING / PODIUM CONTENDER', color: 'text-[#22C55E]' };
    if (score >= 80) return { label: 'VERY STRONG / EXCELLENT', color: 'text-cyan-400' };
    if (score >= 70) return { label: 'GOOD PROTOTYPE', color: 'text-amber-400' };
    return { label: 'NEEDS SUBSTANTIAL ITERATION', color: 'text-rose-400' };
  };

  const handleSubmitEvaluation = async () => {
    if (!team || !round || !user) return;

    if (!feedback.trim()) {
      addToast('ALERT', 'Please include qualitative notes or feedback before submitting.');
      playAlert();
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await evaluationService.submitEvaluation({
        roundId: round.id,
        teamId: team.id,
        evaluatorId: user.evaluatorId || user.id || 'eval-1',
        scores,
        totalScore: totalCalculatedScore,
        feedback,
        strengths,
        improvements,
        status: 'SUBMITTED',
        evaluatedAt: new Date().toISOString(),
      });

      playSubmission();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#10B981', '#06B6D4', '#F59E0B'],
      });

      addToast('SUCCESS', `Evaluation for ${team.name} successfully submitted!`);
      setShowConfirmModal(false);
      setIsSubmittedSuccess(true);
    } catch {
      addToast('ALERT', 'Failed to submit evaluation. Please retry.');
      playAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!team || !round) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Evaluation team not found</h2>
        <p className="text-xs text-slate-400">
          We could not load this team docket.
        </p>
        <Button variant="secondary" onClick={() => navigate('/evaluator/dashboard')}>
          Back to Assigned Teams
        </Button>
      </div>
    );
  }

  if (isSubmittedSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-[#22C55E] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-950/60">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Evaluation Official & Recorded!</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          The score of <strong className="text-[#22C55E] font-mono">{totalCalculatedScore}/100</strong> for{' '}
          <strong className="text-white">{team.name}</strong> in {round.name} has been published to the master evaluation database.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/evaluator/dashboard')}>
            Back to Queue
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/leaderboard')}>
            Inspect Live Leaderboard
          </Button>
        </div>
      </div>
    );
  }

  const tier = getTierLabel(totalCalculatedScore);

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <button
          onClick={() => navigate('/evaluator/dashboard')}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Teams</span>
        </button>

        <Badge variant="gfg" size="sm">
          {round.name}
        </Badge>
      </div>

      {/* Team Summary Card */}
      <Card className="p-5 bg-[#0F1E2E]/90 border border-emerald-500/25 shadow-xl shadow-black/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={team.photoUrl} name={team.name} size="xl" className="ring-2 ring-emerald-500/40" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{team.name}</h1>
                <Badge variant="gfg" size="sm">
                  {team.id}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-[#22C55E]" />
                {team.college}
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Leader: <strong className="text-white">{team.leaderName}</strong> ({team.leaderEmail}) • {team.members.length} Members
              </p>
            </div>
          </div>

          <div className="bg-[#0B1520] p-3 rounded-xl border border-emerald-500/20 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Live Tally</span>
            <span className="text-2xl font-mono font-bold text-[#22C55E]">{totalCalculatedScore} / 100</span>
          </div>
        </div>

        {/* Selected Problem Banner */}
        {problem && (
          <div className="mt-4 pt-3.5 border-t border-slate-700/60 flex items-start gap-2.5">
            <FileCode2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-cyan-400 block">
                {problem.id} • {problem.category}
              </span>
              <p className="text-xs font-semibold text-white">{problem.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{problem.shortDescription}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Multi-Criteria Scoring Rubric */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#22C55E]" />
            Official Evaluation Rubric ({round.criteria.length} Dimensions)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Sum of criteria max = 100</span>
        </div>

        <div className="space-y-3">
          {round.criteria.map((criterion: EvaluationCriterion) => {
            const currentScore = scores[criterion.id] ?? 0;

            return (
              <Card key={criterion.id} className="p-4 bg-[#0F1E2E]/90 border border-emerald-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{criterion.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">(Max {criterion.maxScore})</span>
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">{criterion.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor={`score-${criterion.id}`} className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Enter score
                    </label>
                    <input
                      id={`score-${criterion.id}`}
                      type="number"
                      min={0}
                      max={criterion.maxScore}
                      step={1}
                      value={currentScore}
                      onChange={(e) =>
                        handleScoreChange(criterion.id, parseInt(e.target.value, 10), criterion.maxScore)
                      }
                      aria-label={`${criterion.name} score out of ${criterion.maxScore}`}
                      className="w-20 bg-[#0B1520] border border-emerald-500/40 rounded-lg px-2.5 py-2 text-center font-mono font-bold text-base text-[#22C55E] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <span className="text-xs font-mono text-slate-400">/ {criterion.maxScore}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Qualitative Feedback Textareas */}
      <Card className="p-5 space-y-4 bg-[#0F1E2E]/90 border border-emerald-500/20">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
          Jury Qualitative Notes & Constructive Feedback
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            General Evaluation Feedback & Verdict <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Document code architecture, API performance, adherence to edge constraints, and presentation clarity..."
            className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#22C55E] mb-1">
              Standout Strengths
            </label>
            <textarea
              rows={2}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="e.g. Robust offline model caching, clean schema design..."
              className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-1">
              Areas for Next Round Improvement
            </label>
            <textarea
              rows={2}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="e.g. Implement input fuzzing, refine responsive design..."
              className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </Card>

      {/* Tally and Submission Bar */}
      <div className="p-5 rounded-2xl bg-[#0F1E2E] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Total Awarded Score:</span>
            <span className="text-2xl font-mono font-black text-[#22C55E]">
              {totalCalculatedScore} / 100
            </span>
          </div>
          <span className={`text-[11px] font-mono font-semibold ${tier.color}`}>
            {tier.label}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" onClick={() => navigate('/evaluator/dashboard')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Review & Submit Score
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowConfirmModal(false)}
          title="Submit Official Evaluation"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            <div className="p-3.5 rounded-xl bg-[#0B1520] border border-emerald-500/20 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Squad:</span>
                <span className="font-bold text-white">{team.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Round:</span>
                <span className="font-mono text-emerald-400">Round {round.number}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Final Computed Score:</span>
                <span className="font-mono font-bold text-[#22C55E] text-base">
                  {totalCalculatedScore} / 100
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-950/80 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Once submitted, this score will be recorded and update the live competition leaderboard.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/60">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitEvaluation}
                isLoading={isSubmitting}
              >
                Confirm & Record Evaluation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
