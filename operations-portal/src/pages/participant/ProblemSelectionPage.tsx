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
  Users,
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
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#10B981', '#06B6D4', '#F59E0B'],
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
      <div className="bg-[#0F1E2E]/90 border border-emerald-500/25 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-4 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>HACKODESSEY 4.0 • OFFICIAL REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-['Outfit',sans-serif]">
              PROBLEM STATEMENTS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select ONE challenge for your team. Once confirmed, it is locked in the database (Max 3 teams capacity per statement).
            </p>
          </div>

          <Badge variant="gfg" size="md">
            {problems.length} CHALLENGES REPO
          </Badge>
        </div>

        {/* LOCKED STATE BANNER */}
        {isLocked && chosenProblem && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0E2C1A] to-[#0A1F13] border-2 border-[#22C55E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 shadow-lg shadow-emerald-950/60">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#22C55E] text-slate-950 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#22C55E] uppercase tracking-wider font-mono">
                    ✓ PROBLEM STATEMENT SELECTED
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    STATUS: LOCKED
                  </span>
                </div>
                <p className="text-base font-bold text-white mt-0.5">
                  {chosenProblem.id}: {chosenProblem.title}
                </p>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Your squad has locked this challenge in the PostgreSQL database.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveProblemDetail(chosenProblem)}
              >
                View Specs
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

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0F1E2E]/90 p-3 rounded-xl border border-emerald-500/20 shadow-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem statements by title, keywords, track, or ID..."
            className="w-full bg-[#0B1520] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Problem Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2 font-mono">Loading problem repository from database...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-700 rounded-2xl bg-[#0F1E2E]/60">
          <FileCode2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-semibold">No problem statements match your search</p>
          <p className="text-xs text-slate-500 mt-1">Clear your search input to scroll through all challenges.</p>
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
                  isThisSelected ? 'border-[#22C55E] bg-[#0E2618]/90 ring-2 ring-emerald-500/40' : isLocked ? 'opacity-70' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant={isThisSelected ? 'gfg' : 'gray'} size="sm">
                      {prob.id}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        (prob.selectedByCount || 0) >= 3
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                          : (prob.selectedByCount || 0) > 0
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {prob.selectedByCount || 0}/3 Teams Selected
                      </span>
                      <Badge variant="cyan" size="sm">
                        {prob.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {prob.shortDescription || prob.fullDescription}
                  </p>

                  {prob.deliverables && prob.deliverables.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-700/40 flex flex-wrap gap-1.5">
                      {prob.deliverables.slice(0, 2).map((del, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#0B1520] text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 truncate max-w-full"
                        >
                          • {del}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-emerald-500/15 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveProblemDetail(prob)}
                    className="text-xs text-slate-400 hover:text-emerald-400 font-mono cursor-pointer transition-colors"
                  >
                    View Specs
                  </button>

                  {/* SELECTION BUTTON LOGIC */}
                  {isThisSelected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                      SELECTED — LOCKED
                    </span>
                  ) : isLocked ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 font-mono text-xs cursor-not-allowed flex items-center gap-1.5"
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
          <div className="space-y-4 text-xs text-slate-300 text-left">
            <div>
              <h4 className="font-bold text-white mb-1 uppercase font-mono text-[11px] text-emerald-400">Problem Context & Background</h4>
              <p className="leading-relaxed bg-[#0B1520] p-3 rounded-xl border border-slate-700/60 text-slate-200">
                {activeProblemDetail.fullDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#0B1520] p-3 rounded-xl border border-slate-700/60 space-y-1">
                <h4 className="font-bold text-white uppercase font-mono text-[11px] text-cyan-400">Key Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {activeProblemDetail.deliverables?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0B1520] p-3 rounded-xl border border-slate-700/60 space-y-1">
                <h4 className="font-bold text-white uppercase font-mono text-[11px] text-amber-400">Jury Expectations</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {activeProblemDetail.evaluationFocus?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-500/15 flex items-center justify-between">
              <span className="text-slate-400 font-mono">Owner: {activeProblemDetail.problemOwner}</span>

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
          title="Confirm Challenge Statement Selection"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/30 space-y-2">
              <p className="text-xs text-emerald-400 uppercase font-mono font-bold">You are about to select:</p>
              <p className="text-sm font-mono font-bold text-white">{confirmSelectProblem.id}</p>
              <h4 className="text-base font-bold text-white">{confirmSelectProblem.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2">{confirmSelectProblem.shortDescription || confirmSelectProblem.fullDescription}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>IMPORTANT:</strong> Once confirmed, your squad selection cannot be changed in the database. Are you sure?
              </span>
            </div>

            <div className="pt-3 border-t border-emerald-500/15 flex items-center justify-end gap-3">
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
