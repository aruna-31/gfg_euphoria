import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { problemService } from '../../services/problemService';
import { teamService } from '../../services/teamService';
import { ProblemStatement, Team } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  FileCode2,
  CheckCircle2,
  Search,
  Lock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Image,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProblemSelectionPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const { playSuccess, playAlert } = useAudio();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeProblemDetail, setActiveProblemDetail] = useState<ProblemStatement | null>(null);
  const [confirmSelectProblem, setConfirmSelectProblem] = useState<ProblemStatement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allProblems, currentTeam] = await Promise.all([
        problemService.getAllProblems(),
        teamService.getTeamById(user?.teamId || user?.email || ''),
      ]);
      setProblems(allProblems);
      setTeam(currentTeam);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    // Hide problem statement if 3 teams already selected it, UNLESS my team selected it
    const isSelectedByMyTeam = team?.problemStatementId === p.id;
    const isFull = p.selectedByCount >= 3 || p.selectedByCount >= (p.maxCapacity || 3);
    if (isFull && !isSelectedByMyTeam) {
      return false;
    }

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSelectConfirm = async () => {
    if (!confirmSelectProblem) return;

    const teamIdentifier = team?.id || user?.teamId || user?.email;
    if (!teamIdentifier) {
      addToast('ALERT', 'Unable to resolve your team. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      await problemService.selectProblem(confirmSelectProblem.id, teamIdentifier);
      const [updatedTeam, refreshedProblems] = await Promise.all([
        teamService.getTeamById(teamIdentifier),
        problemService.getAllProblems(),
      ]);
      
      setTeam(updatedTeam);
      setProblems(refreshedProblems);

      // Trigger victory sound and confetti
      try {
        playSuccess();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#DB2777', '#2F8D46'],
        });
      } catch {
        // audio/confetti non-blocking
      }

      addToast(
        'SUCCESS',
        `Problem ${confirmSelectProblem.id} locked! Redirecting to squad photo upload...`
      );

      setConfirmSelectProblem(null);
      setActiveProblemDetail(null);

      // Immediately direct to upload squad photo
      setTimeout(() => {
        navigate('/team/photo');
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Selection failed';
      addToast('ALERT', msg);
      try { playAlert(); } catch {}
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = Boolean(team?.problemStatementId);
  const chosenProblem = problems.find((p) => p.id === team?.problemStatementId);

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#F3E8FF] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-mono font-bold text-pink-700 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL CHALLENGES REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
              PROBLEM STATEMENTS
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Select ONE problem statement for your team. Once confirmed, it is locked in the database and cannot be modified.
            </p>
          </div>

          <Badge variant="pink" size="md">
            {problems.length} AVAILABLE CHALLENGES
          </Badge>
        </div>

        {/* LOCKED STATE BANNER */}
        {isLocked && chosenProblem && (
          <div className="p-4 rounded-xl bg-pink-50 border border-pink-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-pink-200 text-pink-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wider font-mono">
                    ✓ PROBLEM STATEMENT SELECTED
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-200 text-pink-800 border border-pink-300">
                    STATUS: LOCKED
                  </span>
                </div>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {chosenProblem.id}: {chosenProblem.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your team has successfully selected and locked this challenge in the database.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveProblemDetail(chosenProblem)}
              >
                View Full Brief
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/team/photo')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Upload Squad Photo
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar (No Category Pills - scroll through all problem statements directly) */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-pink-100 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all problem statements by title, keyword, or ID..."
            className="w-full bg-[#FAF8FA] border border-pink-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 font-mono"
          />
        </div>
      </div>

      {/* Problem Cards List/Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-2 font-mono">Loading problem repository from database...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-pink-200 rounded-2xl bg-white">
          <FileCode2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-700 font-semibold">No problem statements match your search</p>
          <p className="text-xs text-gray-500 mt-1">Clear your search input to scroll through all problems.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProblems.map((prob) => {
            const isThisSelected = team?.problemStatementId === prob.id;

            return (
              <Card
                key={prob.id}
                variant={isThisSelected ? 'glow' : 'default'}
                className={`flex flex-col justify-between relative transition-all ${
                  isThisSelected ? 'border-pink-500 bg-pink-50/40 ring-2 ring-pink-300' : isLocked ? 'opacity-70' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant={isThisSelected ? 'pink' : 'gray'} size="sm">
                      {prob.id}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        (prob.selectedByCount || 0) >= 3
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : (prob.selectedByCount || 0) > 0
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {prob.selectedByCount || 0}/3 Teams Selected
                      </span>
                      <Badge variant="blue" size="sm">
                        {prob.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
                    {prob.shortDescription || prob.fullDescription}
                  </p>

                  {prob.deliverables && prob.deliverables.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-pink-100 flex flex-wrap gap-1.5">
                      {prob.deliverables.slice(0, 2).map((del, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-pink-50 text-pink-800 px-2.5 py-0.5 rounded-lg border border-pink-200 truncate max-w-full"
                        >
                          • {del}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveProblemDetail(prob)}
                    className="text-xs text-gray-500 hover:text-pink-600 font-mono cursor-pointer"
                  >
                    View Specs
                  </button>

                  {/* SELECTION BUTTON LOGIC */}
                  {isThisSelected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SELECTED — LOCKED
                    </span>
                  ) : isLocked ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-mono text-xs cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      LOCKED
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setConfirmSelectProblem(prob)}
                    >
                      SELECT
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Problem Specifications Detail Modal */}
      {activeProblemDetail && (
        <Modal
          isOpen={true}
          onClose={() => setActiveProblemDetail(null)}
          title={`${activeProblemDetail.id}: ${activeProblemDetail.title}`}
          description={`Track: ${activeProblemDetail.category} • Difficulty: ${activeProblemDetail.difficulty}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-gray-700 text-left">
            <div>
              <h4 className="font-bold text-gray-900 mb-1 uppercase font-mono text-[11px]">Problem Context & Background</h4>
              <p className="leading-relaxed bg-[#FAF8FA] p-3 rounded-xl border border-pink-100 text-gray-800">
                {activeProblemDetail.fullDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#FAF8FA] p-3 rounded-xl border border-pink-100 space-y-1">
                <h4 className="font-bold text-gray-900 uppercase font-mono text-[11px]">Key Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {activeProblemDetail.deliverables?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#FAF8FA] p-3 rounded-xl border border-pink-100 space-y-1">
                <h4 className="font-bold text-gray-900 uppercase font-mono text-[11px]">Jury Expectations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {activeProblemDetail.evaluationFocus?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
              <span className="text-gray-500 font-mono">Owner: {activeProblemDetail.problemOwner}</span>

              {!isLocked && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setConfirmSelectProblem(activeProblemDetail);
                    setActiveProblemDetail(null);
                  }}
                >
                  Select This Problem
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmSelectProblem && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmSelectProblem(null)}
          title="Confirm Problem Statement Selection"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 space-y-2">
              <p className="text-xs text-pink-700 uppercase font-mono font-bold">You are about to select:</p>
              <p className="text-sm font-mono font-bold text-pink-900">{confirmSelectProblem.id}</p>
              <h4 className="text-base font-bold text-gray-900">{confirmSelectProblem.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{confirmSelectProblem.shortDescription || confirmSelectProblem.fullDescription}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>IMPORTANT:</strong> Once confirmed, your team cannot change the problem statement. Are you sure?
              </span>
            </div>

            <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmSelectProblem(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSelectConfirm}
                disabled={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Locking Selection...' : 'Confirm Selection'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
