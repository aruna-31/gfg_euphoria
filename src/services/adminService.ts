import { ActivityFeedItem } from '../types';
import { teamService } from './teamService';
import { evaluatorService } from './evaluatorService';
import { roundService } from './roundService';
import { evaluationService } from './evaluationService';

export interface AdminMetrics {
  totalTeams: number;
  totalParticipants: number;
  totalEvaluators: number;
  activeRoundNumber: number;
  activeRoundName: string;
  evaluationsCompleted: number;
  evaluationsPending: number;
  completionRate: number;
  averageScore: number;
}

class AdminService {
  public async getMetrics(): Promise<AdminMetrics> {
    const [teams, evaluators, activeRound, evaluations] = await Promise.all([
      teamService.getAllTeams(),
      evaluatorService.getAllEvaluators(),
      roundService.getActiveRound(),
      evaluationService.getAllEvaluations(),
    ]);

    const totalParticipants = teams.reduce((total, team) => total + (team.members?.length || 0), 0);
    const scoredTeams = teams.filter((t) => t.totalScore > 0);
    const avgScore =
      evaluations.length > 0
        ? Math.round(evaluations.reduce((acc, e) => acc + e.totalScore, 0) / evaluations.length)
        : scoredTeams.length > 0
        ? Math.round(scoredTeams.reduce((acc, t) => acc + t.totalScore, 0) / scoredTeams.length)
        : 0;

    return {
      totalTeams: teams.length,
      totalParticipants,
      totalEvaluators: evaluators.length,
      activeRoundNumber: activeRound?.number || 1,
      activeRoundName: activeRound?.name || 'Checkpoint 1',
      evaluationsCompleted: evaluations.length,
      evaluationsPending: Math.max(0, teams.length - evaluations.length),
      completionRate: teams.length > 0 ? Math.round((evaluations.length / teams.length) * 100) : 0,
      averageScore: avgScore,
    };
  }

  public async getActivities(): Promise<ActivityFeedItem[]> {
    return [];
  }

  public async addActivity(): Promise<void> {}

  public async getProblemDistribution(): Promise<{ name: string; value: number }[]> {
    return [];
  }
}

export const adminService = new AdminService();

