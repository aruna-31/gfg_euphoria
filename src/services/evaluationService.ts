import { Evaluation } from '../types';
import { MOCK_EVALUATIONS } from '../mock/evaluationsData';
import { teamService } from './teamService';
import { evaluatorService } from './evaluatorService';
import { leaderboardService } from './leaderboardService';

class EvaluationService {
  private evaluations: Evaluation[] = [];

  constructor() {
    const cached = localStorage.getItem('gfg_evaluations_data');
    if (cached) {
      try {
        this.evaluations = JSON.parse(cached);
      } catch {
        this.evaluations = [...MOCK_EVALUATIONS];
      }
    } else {
      this.evaluations = [...MOCK_EVALUATIONS];
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem('gfg_evaluations_data', JSON.stringify(this.evaluations));
  }

  public async getAllEvaluations(): Promise<Evaluation[]> {
    return [...this.evaluations];
  }

  public async getEvaluationsByTeam(teamId: string): Promise<Evaluation[]> {
    return this.evaluations.filter((e) => e.teamId === teamId);
  }

  public async getEvaluationsByEvaluator(evaluatorId: string): Promise<Evaluation[]> {
    return this.evaluations.filter((e) => e.evaluatorId === evaluatorId);
  }

  public async getEvaluationForTeamAndRound(teamId: string, roundId: number): Promise<Evaluation | null> {
    const found = this.evaluations.find((e) => e.teamId === teamId && e.roundId === roundId);
    return found ? { ...found } : null;
  }

  public async getEvaluationForEvaluatorAndRound(
    teamId: string,
    roundId: number,
    evaluatorId: string
  ): Promise<Evaluation | null> {
    const found = this.evaluations.find(
      (evaluation) =>
        evaluation.teamId === teamId &&
        evaluation.roundId === roundId &&
        evaluation.evaluatorId === evaluatorId
    );
    return found ? { ...found } : null;
  }

  public async submitEvaluation(evalData: Omit<Evaluation, 'id' | 'submittedAt'>): Promise<Evaluation> {
    const evaluator = await evaluatorService.getEvaluatorById(evalData.evaluatorId);
    if (!evaluator || evaluator.status !== 'ACTIVE') {
      throw new Error('Evaluator account is inactive or unavailable.');
    }
    if (!evaluator.assignedTeamIds.includes(evalData.teamId)) {
      throw new Error('This team is not assigned to the current evaluator.');
    }
    if (!evaluator.assignedRounds.includes(evalData.roundId)) {
      throw new Error('This round is not assigned to the current evaluator.');
    }

    const newEvaluation: Evaluation = {
      ...evalData,
      id: `eval-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    // Remove any previous draft/submission for this team and round
    const existingIdx = this.evaluations.findIndex(
      (e) =>
        e.teamId === evalData.teamId &&
        e.roundId === evalData.roundId &&
        e.evaluatorId === evalData.evaluatorId
    );

    if (existingIdx !== -1) {
      this.evaluations[existingIdx] = newEvaluation;
    } else {
      this.evaluations.push(newEvaluation);
    }

    this.persist();

    // Propagate score to team record
    const roundEvaluations = this.evaluations.filter(
      (evaluation) => evaluation.teamId === evalData.teamId && evaluation.roundId === evalData.roundId
    );
    const averageScore = Math.round(
      roundEvaluations.reduce((total, evaluation) => total + evaluation.totalScore, 0) /
        roundEvaluations.length
    );
    await teamService.updateRoundScore(evalData.teamId, evalData.roundId, averageScore);
    leaderboardService.notifySubscribers();

    return newEvaluation;
  }
}

export const evaluationService = new EvaluationService();
