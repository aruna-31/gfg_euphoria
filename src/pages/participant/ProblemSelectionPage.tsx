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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProblemSelectionPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const { playSuccess, playAlert } = useAudio();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeProblemDetail, setActiveProblemDetail] = useState<ProblemStatement | null>(null);
  const [confirmSelectProblem, setConfirmSelectProblem] = useState<ProblemStatement | null>(null);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allProblems, currentTeam] = await Promise.all([
        problemService.getAllProblems(),
        teamService.getTeamById(user?.teamId || 'TEAM-001'),
      ]);
      setProblems(allProblems);
      setTeam(currentTeam);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'AI / ML', 'Web3 & Blockchain', 'FinTech', 'Healthcare', 'Smart Cities / IoT', 'EdTech', 'Open Innovation'];

  const filteredProblems = problems.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectConfirm = async () => {
    if (!confirmSelectProblem || !team) return;

    // Strict Backend-Ready Client Validation Guard
    if (team.problemStatementId) {
      addToast('ALERT', 'Conflict: Problem statement has already been selected and cannot be changed.');
      playAlert();
      setConfirmSelectProblem(null);
      return;
    }

    setIsSubmitting(true);
    try {
      await problemService.selectProblem(confirmSelectProblem.id);
      const updatedTeam = await teamService.updateProblemSelection(team.id, confirmSelectProblem.id);
      setTeam(updatedTeam);

      // Trigger victory sound and confetti
      playSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b259', '#00e575', '#ffffff'],
      });

      addToast(
        'SUCCESS',
        `Problem ${confirmSelectProblem.id} locked! You must now upload your official team photo.`
      );

      setConfirmSelectProblem(null);
      setActiveProblemDetail(null);
      setShowPhotoUploadModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Selection failed';
      addToast('ALERT', msg);
      playAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = Boolean(team?.problemStatementId);
  const chosenProblem = problems.find((p) => p.id === team?.problemStatementId);

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0b120e] border border-[#162319] rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#112217] border border-[#1d3d28] text-[11px] font-mono text-[#00e575] mb-2">
              <Sparkles className="w-3 h-3" />
              <span>OFFICIAL CHALLENGES REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              PROBLEM STATEMENTS
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Select ONE problem statement for your team. Once selected, it cannot be changed.
            </p>
          </div>

          <Badge variant="green" size="sm">
            {problems.length} AVAILABLE TRACKS
          </Badge>
        </div>

        {/* LOCKED STATE BANNER */}
        {isLocked && chosenProblem && (
          <div className="p-4 rounded-xl bg-[#08170d] border border-[#00b259]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#00b259]/20 text-[#00e575] shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#00e575] uppercase tracking-wider font-mono">
                    ✓ PROBLEM STATEMENT SELECTED
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    STATUS: LOCKED
                  </span>
                </div>
                <p className="text-base font-bold text-white mt-0.5">
                  {chosenProblem.id}: {chosenProblem.title}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Your team has successfully selected and locked this problem statement.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveProblemDetail(chosenProblem)}
              className="shrink-0"
            >
              View Full Specification
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0a0f0c] p-3 rounded-xl border border-[#1c2c21]">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00b259] text-black font-bold shadow-md shadow-[#00b259]/20'
                  : 'bg-[#101712] text-gray-400 hover:text-white hover:bg-[#16221a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or ID..."
            className="w-full bg-[#080d0a] border border-[#1c2c21] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00b259] font-mono"
          />
        </div>
      </div>

      {/* Problem Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#00b259] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-2 font-mono">Loading problem repository...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#1e2f23] rounded-2xl bg-[#090d0b]">
          <FileCode2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-300 font-semibold">No problem statements match your search</p>
          <p className="text-xs text-gray-500 mt-1">Try selecting 'ALL' categories or clearing search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((prob) => {
            const isThisSelected = team?.problemStatementId === prob.id;

            return (
              <Card
                key={prob.id}
                variant={isThisSelected ? 'glow' : 'default'}
                className={`flex flex-col justify-between relative group transition-all ${
                  isThisSelected ? 'border-[#00e575] bg-[#09170e]' : isLocked ? 'opacity-75' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant={isThisSelected ? 'green' : 'gray'} size="sm">
                      {prob.id}
                    </Badge>
                    <Badge
                      variant={
                        prob.difficulty === 'ADVANCED'
                          ? 'purple'
                          : prob.difficulty === 'INTERMEDIATE'
                          ? 'blue'
                          : 'amber'
                      }
                      size="sm"
                    >
                      {prob.difficulty}
                    </Badge>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00e575]">
                    {prob.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-[#00e575] transition-colors leading-snug">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {prob.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#16231a] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveProblemDetail(prob)}
                    className="text-xs text-gray-400 hover:text-white font-mono cursor-pointer"
                  >
                    View Specs
                  </button>

                  {/* SELECTION BUTTON LOGIC */}
                  {isThisSelected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00e575] bg-[#00b259]/15 px-3 py-1.5 rounded-lg border border-[#00b259]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SELECTED — LOCKED
                    </span>
                  ) : isLocked ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-lg bg-[#111913] border border-[#1b2b20] text-gray-500 font-mono text-xs cursor-not-allowed flex items-center gap-1.5"
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
          description={`Domain Track: ${activeProblemDetail.category} • Difficulty: ${activeProblemDetail.difficulty}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-gray-300 text-left">
            <div>
              <h4 className="font-semibold text-white mb-1 uppercase font-mono text-[11px]">Problem Context & Background</h4>
              <p className="leading-relaxed text-gray-300 bg-[#070a08] p-3 rounded-xl border border-[#152319]">
                {activeProblemDetail.fullDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#070a08] p-3 rounded-xl border border-[#152319] space-y-1">
                <h4 className="font-semibold text-white uppercase font-mono text-[11px]">Expected Deliverables</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {activeProblemDetail.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#070a08] p-3 rounded-xl border border-[#152319] space-y-1">
                <h4 className="font-semibold text-white uppercase font-mono text-[11px]">Jury Evaluation Focus</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {activeProblemDetail.evaluationFocus.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b2b20] flex items-center justify-between">
              <span className="text-gray-500 font-mono">Problem Owner: {activeProblemDetail.problemOwner}</span>

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
            <div className="p-4 rounded-xl bg-[#09140c] border border-[#00b259]/30 space-y-2">
              <p className="text-xs text-gray-400 uppercase font-mono">You are about to select:</p>
              <p className="text-sm font-mono font-bold text-[#00e575]">{confirmSelectProblem.id}</p>
              <h4 className="text-base font-bold text-white">{confirmSelectProblem.title}</h4>
              <p className="text-xs text-gray-300 line-clamp-2">{confirmSelectProblem.shortDescription}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>IMPORTANT:</strong> Once confirmed, your team cannot change the problem statement. Are you sure?
              </span>
            </div>

            <div className="pt-3 border-t border-[#1c2c20] flex items-center justify-end gap-3">
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

      {/* MANDATORY PHOTO UPLOAD NEXT STEP MODAL */}
      {showPhotoUploadModal && (
        <Modal
          isOpen={true}
          onClose={() => navigate('/team/photo')}
          title="Selection Locked • Mandatory Next Step"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-[#00b259]/10 border border-[#00b259]/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#00e575] text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Problem Statement Locked!</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                As per official Hackathon Requirements:
              </p>
              <p className="text-xs text-white font-semibold bg-[#08120b] p-2.5 rounded-lg border border-[#1b3323]">
                "Once the problem statement selection is completed, the respective team must upload a group photo."
              </p>
            </div>

            <p className="text-xs text-gray-400">
              Evaluators and live leaderboard viewers require your verified squad photo before Round 2 scoring can proceed.
            </p>

            <div className="pt-3 border-t border-[#1c2c20] flex justify-end">
              <Button
                variant="primary"
                onClick={() => navigate('/team/photo')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Proceed to Group Photo Upload
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
