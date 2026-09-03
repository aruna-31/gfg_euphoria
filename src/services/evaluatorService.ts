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

  public async assignTeam(evaluatorId: string, teamId: string): Promise<Evaluator> {
    const idx = this.evaluators.findIndex((e) => e.id === evaluatorId);
    if (idx === -1) throw new Error(`Evaluator ${evaluatorId} not found`);

    if (!this.evaluators[idx].assignedTeamIds.includes(teamId)) {
      this.evaluators[idx].assignedTeamIds.push(teamId);
      this.evaluators[idx].pendingCount += 1;
      this.persist();
    }
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
