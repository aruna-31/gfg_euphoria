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
  Sparkles,
  FileCode2,
  Users,
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

      setTeam(teamData);
      setRound(roundData);

      if (teamData?.problemStatementId) {
        const prob = await problemService.getProblemById(teamData.problemStatementId);
        setProblem(prob);
      }

      // Check if existing evaluation exists
      if (teamData && roundData) {
        const existing = await evaluationService.getEvaluationForTeamAndRound(
          teamData.id,
          roundData.id
        );
        if (existing) {
          setScores(existing.scores);
          setFeedback(existing.feedback || '');
          setStrengths(existing.strengths || '');
          setImprovements(existing.improvements || '');
        } else {
          // Initialize default sensible scores (~80%)
          const initialScores: Record<string, number> = {};
          roundData.criteria.forEach((c) => {
            initialScores[c.id] = Math.round(c.maxScore * 0.85);
          });
          setScores(initialScores);
        }
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
    if (score >= 90) return { label: 'OUTSTANDING / PODIUM CONTENDER', color: 'text-[#00e575]' };
    if (score >= 80) return { label: 'VERY STRONG / EXCELLENT', color: 'text-sky-400' };
    if (score >= 70) return { label: 'GOOD PROTOTYPE', color: 'text-amber-400' };
    return { label: 'NEEDS SUBSTANTIAL ITERATION', color: 'text-red-400' };
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
        evaluatorId: user.evaluatorId || 'eval-1',
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00b259', '#38bdf8'],
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

  if (loading || !team || !round) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (isSubmittedSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#00b259]/20 border border-[#00b259]/40 text-[#00e575] flex items-center justify-center mx-auto shadow-xl shadow-[#00b259]/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Evaluation Official & Recorded!</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          The score of <strong className="text-[#00e575] font-mono">{totalCalculatedScore}/100</strong> for{' '}
          <strong className="text-white">{team.name}</strong> in {round.name} has been published to the master evaluation database.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/evaluator/dashboard')}>
            Back to Queue
          </Button>
          <Button variant="primary" onClick={() => navigate('/team/leaderboard')}>
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
      <div className="flex items-center justify-between border-b border-[#1b2b20] pb-4">
        <button
          onClick={() => navigate('/evaluator/dashboard')}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Teams</span>
        </button>

        <Badge variant="blue" size="sm">
          {round.name}: {round.title}
        </Badge>
      </div>

      {/* Team Summary Card */}
      <Card className="p-5 bg-gradient-to-r from-[#0d1611] to-[#0a0f0d] border border-[#203627]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={team.photoUrl} name={team.name} size="xl" className="ring-2 ring-[#00b259]/40" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{team.name}</h1>
                <Badge variant="green" size="sm">
                  {team.id}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-gray-500" />
                {team.college}
              </p>
              <p className="text-[11px] font-mono text-gray-400 mt-1">
                Leader: {team.leaderName} ({team.leaderEmail}) • {team.members.length} Members
              </p>
            </div>
          </div>

          <div className="bg-[#080d0a] p-3 rounded-xl border border-[#1b2b20] text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">Total Live Tally</span>
            <span className="text-2xl font-mono font-bold text-[#00e575]">{totalCalculatedScore} / 100</span>
          </div>
        </div>

        {/* Selected Problem Banner */}
        {problem && (
          <div className="mt-4 pt-3.5 border-t border-[#1a291f] flex items-start gap-2.5">
            <FileCode2 className="w-4 h-4 text-[#00e575] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-[#00e575] block">
                {problem.id} • {problem.category}
              </span>
              <p className="text-xs font-semibold text-gray-200">{problem.title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{problem.shortDescription}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Multi-Criteria Scoring Rubric */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-gray-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00e575]" />
            Official Evaluation Rubric ({round.criteria.length} Dimensions)
          </h2>
          <span className="text-[11px] font-mono text-gray-400">Sum of criteria max = 100</span>
        </div>

        <div className="space-y-3">
          {round.criteria.map((criterion: EvaluationCriterion) => {
            const currentScore = scores[criterion.id] ?? 0;

            return (
              <Card key={criterion.id} className="p-4 bg-[#090e0b]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{criterion.name}</span>
                      <span className="text-[10px] font-mono text-gray-500">(Max {criterion.maxScore})</span>
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{criterion.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={criterion.maxScore}
                      value={currentScore}
                      onChange={(e) =>
                        handleScoreChange(criterion.id, parseInt(e.target.value, 10), criterion.maxScore)
                      }
                      className="w-16 bg-[#060907] border border-[#213526] rounded-lg px-2 py-1 text-center font-mono font-bold text-sm text-[#00e575] focus:outline-none focus:border-[#00b259]"
                    />
                    <span className="text-xs font-mono text-gray-400">/ {criterion.maxScore}</span>
                  </div>
                </div>

                {/* Interactive Slider */}
                <input
                  type="range"
                  min={0}
                  max={criterion.maxScore}
                  value={currentScore}
                  onChange={(e) =>
                    handleScoreChange(criterion.id, parseInt(e.target.value, 10), criterion.maxScore)
                  }
                  className="w-full accent-[#00b259] h-1.5 bg-[#142017] rounded-lg cursor-pointer"
                />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Qualitative Feedback Textareas */}
      <Card className="p-5 space-y-4 bg-[#090e0b]">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-200">
          Jury Qualitative Notes & Constructive Feedback
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            General Evaluation Feedback & Verdict <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Document code architecture, API performance, adherence to edge constraints, and presentation clarity..."
            className="w-full bg-[#060907] border border-[#1e2f23] rounded-xl p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259] focus:ring-1 focus:ring-[#00b259]/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">
              Standout Strengths
            </label>
            <textarea
              rows={2}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="e.g. Robust offline model caching, zero PII leakage in zk-proof..."
              className="w-full bg-[#060907] border border-[#1e2f23] rounded-xl p-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
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
              placeholder="e.g. Implement input fuzzing, refine mobile view on smaller viewports..."
              className="w-full bg-[#060907] border border-[#1e2f23] rounded-xl p-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259]"
            />
          </div>
        </div>
      </Card>

      {/* Tally and Submission Bar */}
      <div className="p-5 rounded-2xl bg-[#0c1410] border border-[#223528] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-300">Total Awarded Score:</span>
            <span className="text-2xl font-mono font-black text-[#00e575]">
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
            <div className="p-3.5 rounded-xl bg-[#090e0b] border border-[#1b2b20] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Team:</span>
                <span className="font-bold text-white">{team.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Round:</span>
                <span className="font-mono text-gray-200">Round {round.number}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Final Computed Score:</span>
                <span className="font-mono font-bold text-[#00e575] text-base">
                  {totalCalculatedScore} / 100
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Once submitted, this score will immediately recalculate the live podium standings.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1c2c20]">
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
