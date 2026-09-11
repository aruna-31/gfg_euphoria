import { ProblemStatement } from '../types';
import { MOCK_PROBLEMS } from '../mock/problemsData';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ProblemService {
  private problems: ProblemStatement[] = [];

  constructor() {
    this.problems = [...MOCK_PROBLEMS];
  }

  public async getAllProblems(): Promise<ProblemStatement[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/problems`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback to local
    }
    return [...this.problems];
  }

  public async getProblemById(id: string): Promise<ProblemStatement | null> {
    const problems = await this.getAllProblems();
    const found = problems.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  public async selectProblem(problemId: string, teamId: string = 'TEAM-001'): Promise<ProblemStatement> {
    const res = await fetch(`${API_BASE_URL}/problems/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: teamId, problem_id: problemId }),
    });

    if (res.status === 409) {
      throw new Error('Conflict: Problem statement has already been selected and cannot be changed.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to select problem statement.' }));
      throw new Error(err.detail || 'Failed to select problem statement.');
    }

    const data = await res.json();
    return data;
  }
}

export const problemService = new ProblemService();

