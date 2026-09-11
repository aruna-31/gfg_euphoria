import { ActivityFeedItem } from '../types';
import { teamService } from './teamService';
import { evaluatorService } from './evaluatorService';

export interface AdminMetrics { totalTeams: number; totalParticipants: number; totalEvaluators: number; activeRoundNumber: number; activeRoundName: string; evaluationsCompleted: number; evaluationsPending: number; completionRate: number; averageScore: number; }
class AdminService {
  public async getMetrics(): Promise<AdminMetrics> {
    const [teams, evaluators] = await Promise.all([teamService.getAllTeams(), evaluatorService.getAllEvaluators()]);
    return { totalTeams: teams.length, totalParticipants: teams.reduce((total, team) => total + (team.members?.length || 0), 0), totalEvaluators: evaluators.length, activeRoundNumber: 0, activeRoundName: 'Not scheduled', evaluationsCompleted: 0, evaluationsPending: 0, completionRate: 0, averageScore: 0 };
  }
  public async getActivities(): Promise<ActivityFeedItem[]> { return []; }
  public async addActivity(): Promise<void> {}
  public async getProblemDistribution(): Promise<{ name: string; value: number }[]> { return []; }
}
export const adminService = new AdminService();
