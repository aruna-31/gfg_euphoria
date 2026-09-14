import React, { useEffect, useState } from 'react';
import { evaluatorService } from '../../services/evaluatorService';
import { teamService } from '../../services/teamService';
import { roundService } from '../../services/roundService';
import { problemService } from '../../services/problemService';
import { useNotification } from '../../context/NotificationContext';
import { useAudio } from '../../context/AudioContext';
import { Evaluator, Team, Round, ProblemStatement } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ListTodo, Plus, Trash2, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  const { addToast } = useNotification();
  const { playSuccess } = useAudio();

  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [selectedEvalId, setSelectedEvalId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evals, allTeams, allRounds, allProblems] = await Promise.all([
        evaluatorService.getAllEvaluators(),
        teamService.getAllTeams(),
        roundService.getAllRounds(),
        problemService.getAllProblems(),
      ]);
      setEvaluators(evals);
      setTeams(allTeams);
      setRounds(allRounds);
      setProblems(allProblems);
      if (evals.length > 0) setSelectedEvalId((prev) => (prev && evals.some((e) => e.id === prev) ? prev : evals[0].id));
      if (allTeams.length > 0) setSelectedTeamId((prev) => (prev && allTeams.some((t) => t.id === prev) ? prev : allTeams[0].id));
      if (allRounds.length > 0) setSelectedRoundId((prev) => (prev && allRounds.some((r) => String(r.id) === prev) ? prev : String(allRounds[0].id)));
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedEvalId || !selectedTeamId) return;

    try {
      await evaluatorService.assignTeam(
        selectedEvalId,
        selectedTeamId
      );
      const updatedEvals = await evaluatorService.getAllEvaluators();
      setEvaluators(updatedEvals);
      playSuccess();
      addToast('SUCCESS', `Assigned ${selectedTeamId} to evaluator.`);
    } catch {
      addToast('ALERT', 'Assignment failed.');
    }
  };

  const handleUnassign = async (evalId: string, teamId: string) => {
    try {
      await evaluatorService.unassignTeam(evalId, teamId);
      const updatedEvals = await evaluatorService.getAllEvaluators();
      setEvaluators(updatedEvals);
      addToast('INFO', `Unassigned ${teamId}.`);
    } catch {
      addToast('ALERT', 'Unassignment failed.');
    }
  };

  const currentEval = evaluators.find((e) => e.id === selectedEvalId);

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div className="border-b border-[#1b2b20] pb-5">
        <h1 className="text-2xl font-extrabold text-white">Evaluator Workload Assignment</h1>
        <p className="text-xs text-gray-400 mt-1">
          Distribute teams evenly among panel evaluators and avoid evaluation overlaps.
        </p>
      </div>

      {/* Assignment Control Box */}
      <Card className="p-5 bg-[#090e0b]">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e575] mb-3">
          Quick Workload Dispatcher
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Select Evaluator
            </label>
            <select
              value={selectedEvalId}
              onChange={(e) => setSelectedEvalId(e.target.value)}
              className="w-full bg-[#060907] border border-[#203627] rounded-lg p-2 text-xs text-white"
            >
              {evaluators.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.assignedTeamIds.length} teams)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Round</label>
            <select
              value={selectedRoundId}
              onChange={(e) => setSelectedRoundId(e.target.value)}
              className="w-full bg-[#060907] border border-[#203627] rounded-lg p-2 text-xs text-white"
            >
              {rounds.map((round) => <option key={round.id} value={round.id}>Round {round.number}: {round.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Problem track</label>
            <select
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="w-full bg-[#060907] border border-[#203627] rounded-lg p-2 text-xs text-white"
            >
              <option value="">Use team&apos;s selected track</option>
              {problems.map((problem) => <option key={problem.id} value={problem.id}>{problem.id} - {problem.title}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Select Team to Assign
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-[#060907] border border-[#203627] rounded-lg p-2 text-xs text-white"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.name} ({t.college})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Button
              variant="primary"
              onClick={handleAssign}
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Assign to Evaluator
            </Button>
          </div>
        </div>
      </Card>

      {/* Current Evaluator Roster */}
      {currentEval && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#18261d] pb-3">
            <div className="flex items-center gap-3">
              <Avatar src={currentEval.avatarUrl} name={currentEval.name} size="md" />
              <div>
                <h3 className="text-sm font-bold text-white">{currentEval.name}</h3>
                <p className="text-xs text-gray-400">
                  {currentEval.organization} • {currentEval.designation}
                </p>
              </div>
            </div>

            <Badge variant="green" size="sm">
              {currentEval.assignedTeamIds.length} TEAMS ALLOCATED
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentEval.assignedTeamIds.map((tId) => {
              const teamObj = teams.find((t) => t.id === tId);

              return (
                <div
                  key={tId}
                  className="p-3 rounded-xl bg-[#080d0a] border border-[#18261d] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="font-bold text-white truncate block">
                      {teamObj?.name || tId}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {tId} • {teamObj?.college || ''}
                    </span>
                  </div>

                  <button
                    onClick={() => handleUnassign(currentEval.id, tId)}
                    className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
                    title="Remove assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
