import { Evaluator } from '../types';
import { MOCK_EVALUATORS } from '../mock/evaluatorsData';

class EvaluatorService {
  private evaluators: Evaluator[] = [];

  constructor() {
    const cached = localStorage.getItem('gfg_evaluators_data');
    if (cached) {
      try {
        this.evaluators = JSON.parse(cached);
      } catch {
        this.evaluators = [...MOCK_EVALUATORS];
      }
    } else {
      this.evaluators = [...MOCK_EVALUATORS];
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem('gfg_evaluators_data', JSON.stringify(this.evaluators));
  }

  public async getAllEvaluators(): Promise<Evaluator[]> {
    return [...this.evaluators];
  }

  public async getEvaluatorById(id: string): Promise<Evaluator | null> {
    const found = this.evaluators.find((e) => e.id === id);
    return found ? { ...found } : null;
  }

  public async createEvaluator(data: Pick<Evaluator, 'name' | 'email' | 'designation' | 'organization'> & { accessPassword?: string }): Promise<Evaluator> {
    if (this.evaluators.some((evaluator) => evaluator.email.toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error('An evaluator with this email already exists.');
    }

    const evaluator: Evaluator = {
      ...data,
      id: `eval-${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      expertise: [],
      assignedTeamIds: [],
      assignedRounds: [],
      assignedProblemStatementIds: [],
      completedCount: 0,
      pendingCount: 0,
      status: 'ACTIVE',
      accessPassword: data.accessPassword || 'eval123',
    };
    this.evaluators.push(evaluator);
    this.persist();
    return { ...evaluator };
  }

  public async setStatus(evaluatorId: string, status: Evaluator['status']): Promise<Evaluator> {
    const idx = this.evaluators.findIndex((evaluator) => evaluator.id === evaluatorId);
    if (idx === -1) throw new Error(`Evaluator ${evaluatorId} not found`);
    this.evaluators[idx] = { ...this.evaluators[idx], status };
    this.persist();
    return { ...this.evaluators[idx] };
  }

  public async assignTeam(evaluatorId: string, teamId: string, roundId?: number, problemStatementId?: string): Promise<Evaluator> {
    const idx = this.evaluators.findIndex((e) => e.id === evaluatorId);
    if (idx === -1) throw new Error(`Evaluator ${evaluatorId} not found`);

    if (!this.evaluators[idx].assignedTeamIds.includes(teamId)) {
      this.evaluators[idx].assignedTeamIds.push(teamId);
      this.evaluators[idx].pendingCount += 1;
      this.persist();
    }
    if (roundId && !this.evaluators[idx].assignedRounds.includes(roundId)) {
      this.evaluators[idx].assignedRounds.push(roundId);
    }
    if (problemStatementId) {
      const assignedProblems = this.evaluators[idx].assignedProblemStatementIds || [];
      if (!assignedProblems.includes(problemStatementId)) assignedProblems.push(problemStatementId);
      this.evaluators[idx].assignedProblemStatementIds = assignedProblems;
    }
    this.persist();
    return { ...this.evaluators[idx] };
  }

  public async unassignTeam(evaluatorId: string, teamId: string): Promise<Evaluator> {
    const idx = this.evaluators.findIndex((e) => e.id === evaluatorId);
    if (idx === -1) throw new Error(`Evaluator ${evaluatorId} not found`);

    this.evaluators[idx].assignedTeamIds = this.evaluators[idx].assignedTeamIds.filter((id) => id !== teamId);
    this.evaluators[idx].pendingCount = Math.max(0, this.evaluators[idx].pendingCount - 1);
    this.persist();
    return { ...this.evaluators[idx] };
  }
}

export const evaluatorService = new EvaluatorService();
