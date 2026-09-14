import { Evaluator } from '../types';

class EvaluatorService {
  private evaluators: Evaluator[] = [];

  constructor() {
    localStorage.removeItem('gfg_evaluators_data');
  }

  public async getAllEvaluators(): Promise<Evaluator[]> {
    return [...this.evaluators];
  }

  public async getEvaluatorById(id: string): Promise<Evaluator | null> {
    return this.evaluators.find((item) => item.id === id) || null;
  }

  public async assignTeam(evaluatorId: string, teamId: string): Promise<Evaluator> {
    const ev = this.evaluators.find((e) => e.id === evaluatorId);
    if (!ev) throw new Error('Evaluator not found');
    if (!ev.assignedTeamIds.includes(teamId)) {
      ev.assignedTeamIds.push(teamId);
      ev.pendingCount = ev.assignedTeamIds.length - ev.completedCount;
    }
    return { ...ev };
  }

  public async unassignTeam(evaluatorId: string, teamId: string): Promise<Evaluator> {
    const ev = this.evaluators.find((e) => e.id === evaluatorId);
    if (!ev) throw new Error('Evaluator not found');
    ev.assignedTeamIds = ev.assignedTeamIds.filter((t) => t !== teamId);
    ev.pendingCount = Math.max(0, ev.assignedTeamIds.length - ev.completedCount);
    return { ...ev };
  }

  public async createEvaluator(data: Partial<Evaluator>): Promise<Evaluator> {
    const newEval: Evaluator = {
      id: `eval-${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      organization: data.organization || '',
      designation: data.designation || '',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'eval'}`,
      assignedTeamIds: [],
      assignedRounds: [1, 2],
      completedCount: 0,
      pendingCount: 0,
      expertise: [],
      status: 'ACTIVE',
    };
    this.evaluators.push(newEval);
    return newEval;
  }

  public async setStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    const ev = this.evaluators.find((e) => e.id === id);
    if (ev) ev.status = status;
  }
}

export const evaluatorService = new EvaluatorService();


