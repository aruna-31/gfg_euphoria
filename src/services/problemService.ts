import { ProblemStatement } from '../types';
import { MOCK_PROBLEMS } from '../mock/problemsData';

class ProblemService {
  private problems: ProblemStatement[] = [];

  constructor() {
    const cached = localStorage.getItem('gfg_problems_data');
    if (cached) {
      try {
        this.problems = JSON.parse(cached);
      } catch {
        this.problems = [...MOCK_PROBLEMS];
      }
    } else {
      this.problems = [...MOCK_PROBLEMS];
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem('gfg_problems_data', JSON.stringify(this.problems));
  }

  public async getAllProblems(): Promise<ProblemStatement[]> {
    return [...this.problems];
  }

  public async getProblemById(id: string): Promise<ProblemStatement | null> {
    const found = this.problems.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  public async selectProblem(problemId: string): Promise<ProblemStatement> {
    const index = this.problems.findIndex((p) => p.id === problemId);
    if (index === -1) throw new Error(`Problem ${problemId} not found`);

    if (this.problems[index].selectedByCount >= this.problems[index].maxCapacity) {
      throw new Error(`Problem ${problemId} has reached maximum team capacity.`);
    }

    this.problems[index] = {
      ...this.problems[index],
      selectedByCount: this.problems[index].selectedByCount + 1,
    };
    this.persist();
    return { ...this.problems[index] };
  }
}

export const problemService = new ProblemService();
