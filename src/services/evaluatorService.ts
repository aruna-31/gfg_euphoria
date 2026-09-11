import { Evaluator } from '../types';

class EvaluatorService {
  private evaluators: Evaluator[] = [];
  constructor() { localStorage.removeItem('gfg_evaluators_data'); }
  public async getAllEvaluators(): Promise<Evaluator[]> { return [...this.evaluators]; }
  public async getEvaluatorById(id: string): Promise<Evaluator | null> { return this.evaluators.find((item) => item.id === id) || null; }
  public async assignTeam(_evaluatorId: string, _teamId: string): Promise<Evaluator> { throw new Error('Evaluator assignments have not been imported yet.'); }
  public async unassignTeam(_evaluatorId: string, _teamId: string): Promise<Evaluator> { throw new Error('Evaluator assignments have not been imported yet.'); }
}
export const evaluatorService = new EvaluatorService();
