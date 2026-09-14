import { Evaluator } from '../types';

const INITIAL_EVALUATORS: Evaluator[] = [
  {
    id: 'usr-eval-1',
    name: 'Nandu',
    email: 'nandulavanuru@gmail.com',
    organization: 'KARE',
    designation: 'Jury Evaluator',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nandu',
    assignedTeamIds: [],
    assignedRounds: [1, 2, 3],
    completedCount: 0,
    pendingCount: 0,
    expertise: ['Full-Stack', 'AI/ML', 'System Design'],
    status: 'ACTIVE',
  },
];

class EvaluatorService {
  private evaluators: Evaluator[] = [];
  private readonly storageKey = 'gfg_evaluators_data';

  constructor() {
    this.load();
  }

  private load() {
    const cached = localStorage.getItem(this.storageKey);
    if (cached) {
      try {
        const parsed: Evaluator[] = JSON.parse(cached);
        const hasNandu = parsed.some((e) => e.email.toLowerCase() === 'nandulavanuru@gmail.com');
        if (!hasNandu) {
          this.evaluators = [...INITIAL_EVALUATORS, ...parsed];
        } else {
          this.evaluators = parsed;
        }
      } catch {
        this.evaluators = [...INITIAL_EVALUATORS];
      }
    } else {
      this.evaluators = [...INITIAL_EVALUATORS];
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.evaluators));
  }

  public async getAllEvaluators(): Promise<Evaluator[]> {
    this.load();
    return [...this.evaluators];
  }

  public async getEvaluatorById(id: string): Promise<Evaluator | null> {
    this.load();
    const clean = id.trim().toLowerCase();
    return this.evaluators.find((item) => item.id.toLowerCase() === clean || item.email.toLowerCase() === clean) || null;
  }

  public async getEvaluatorByEmail(email: string): Promise<Evaluator | null> {
    this.load();
    const clean = email.trim().toLowerCase();
    return this.evaluators.find((item) => item.email.toLowerCase() === clean) || null;
  }

  public async assignTeam(evaluatorId: string, teamId: string): Promise<Evaluator> {
    this.load();
    const cleanId = evaluatorId.trim().toLowerCase();
    const ev = this.evaluators.find((e) => e.id.toLowerCase() === cleanId || e.email.toLowerCase() === cleanId);
    if (!ev) throw new Error('Evaluator not found');

    if (!ev.assignedTeamIds.includes(teamId)) {
      ev.assignedTeamIds.push(teamId);
      ev.pendingCount = ev.assignedTeamIds.length - ev.completedCount;
      this.persist();
    }
    return { ...ev };
  }

  public async unassignTeam(evaluatorId: string, teamId: string): Promise<Evaluator> {
    this.load();
    const cleanId = evaluatorId.trim().toLowerCase();
    const ev = this.evaluators.find((e) => e.id.toLowerCase() === cleanId || e.email.toLowerCase() === cleanId);
    if (!ev) throw new Error('Evaluator not found');

    ev.assignedTeamIds = ev.assignedTeamIds.filter((t) => t !== teamId);
    ev.pendingCount = Math.max(0, ev.assignedTeamIds.length - ev.completedCount);
    this.persist();
    return { ...ev };
  }

  public async markEvaluationComplete(evaluatorId: string): Promise<void> {
    this.load();
    const cleanId = evaluatorId.trim().toLowerCase();
    const ev = this.evaluators.find((e) => e.id.toLowerCase() === cleanId || e.email.toLowerCase() === cleanId);
    if (ev) {
      ev.completedCount += 1;
      ev.pendingCount = Math.max(0, ev.assignedTeamIds.length - ev.completedCount);
      this.persist();
    }
  }

  public async createEvaluator(data: Partial<Evaluator>): Promise<Evaluator> {
    this.load();
    const newEval: Evaluator = {
      id: `usr-eval-${Date.now()}`,
      name: data.name || '',
      email: (data.email || '').trim().toLowerCase(),
      organization: data.organization || 'KARE',
      designation: data.designation || 'Jury Evaluator',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'eval'}`,
      assignedTeamIds: [],
      assignedRounds: [1, 2, 3],
      completedCount: 0,
      pendingCount: 0,
      expertise: ['Full-Stack', 'AI/ML', 'System Design'],
      status: 'ACTIVE',
    };
    this.evaluators.push(newEval);
    this.persist();
    return newEval;
  }

  public async setStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    this.load();
    const cleanId = id.trim().toLowerCase();
    const ev = this.evaluators.find((e) => e.id.toLowerCase() === cleanId || e.email.toLowerCase() === cleanId);
    if (ev) {
      ev.status = status;
      this.persist();
    }
  }
}

export const evaluatorService = new EvaluatorService();



