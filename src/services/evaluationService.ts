import { Evaluation } from '../types';
import { API_BASE_URL } from './apiConfig';
import { teamService } from './teamService';
import { evaluatorService } from './evaluatorService';
import { leaderboardService } from './leaderboardService';

class EvaluationService {
  private evaluations: Evaluation[] = [];
  private readonly storageKey = 'gfg_evaluations_data';

  constructor() {
    this.load();
  }

  private load() {
    const cached = localStorage.getItem(this.storageKey);
    if (cached) {
      try {
        this.evaluations = JSON.parse(cached);
      } catch {
        this.evaluations = [];
      }
    } else {
      this.evaluations = [];
    }
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.evaluations));
  }

  public async getAllEvaluations(): Promise<Evaluation[]> {
    this.load();
    return [...this.evaluations];
  }

  public async getEvaluationsByTeam(teamId: string): Promise<Evaluation[]> {
    this.load();
    return this.evaluations.filter((e) => e.teamId === teamId);
  }

  public async getEvaluationsByEvaluator(evaluatorId: string): Promise<Evaluation[]> {
    this.load();
    const cleanId = evaluatorId.trim().toLowerCase();
    return this.evaluations.filter((e) => e.evaluatorId.toLowerCase() === cleanId);
  }

  public async getEvaluationForTeamAndRound(teamId: string, roundId: number): Promise<Evaluation | null> {
    this.load();
    const found = this.evaluations.find((e) => e.teamId === teamId && e.roundId === roundId);
    return found ? { ...found } : null;
  }

  public async getEvaluationForEvaluatorAndRound(
    teamId: string,
    roundId: number,
    evaluatorId: string
  ): Promise<Evaluation | null> {
    this.load();
    const cleanId = evaluatorId.trim().toLowerCase();
    const found = this.evaluations.find(
      (evaluation) =>
        evaluation.teamId === teamId &&
        evaluation.roundId === roundId &&
        evaluation.evaluatorId.toLowerCase() === cleanId
    );
    return found ? { ...found } : null;
  }

  public async submitEvaluation(evalData: Omit<Evaluation, 'id' | 'submittedAt'>): Promise<Evaluation> {
    this.load();
    const newEvaluation: Evaluation = {
      ...evalData,
      id: `eval-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    // 1. Submit to backend API
    try {
      await fetch(`${API_BASE_URL}/evaluations/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: evalData.teamId,
          round_id: evalData.roundId,
          scores: evalData.scores,
          total_score: evalData.totalScore,
          feedback: evalData.feedback || '',
          strengths: evalData.strengths || '',
          improvements: evalData.improvements || '',
        }),
      });
    } catch {
      // Offline fallback allowed
    }

    // 2. Save locally
    const existingIdx = this.evaluations.findIndex(
      (e) =>
        e.teamId === evalData.teamId &&
        e.roundId === evalData.roundId &&
        e.evaluatorId.toLowerCase() === evalData.evaluatorId.toLowerCase()
    );

    if (existingIdx !== -1) {
      this.evaluations[existingIdx] = newEvaluation;
    } else {
      this.evaluations.push(newEvaluation);
    }
    this.persist();

    // 3. Update team round score and evaluator status
    await teamService.updateRoundScore(evalData.teamId, evalData.roundId, evalData.totalScore);
    await evaluatorService.markEvaluationComplete(evalData.evaluatorId);
    leaderboardService.notifySubscribers();

    return newEvaluation;
  }
}

export const evaluationService = new EvaluationService();
