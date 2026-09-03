import { ActivityFeedItem } from '../types';
import { teamService } from './teamService';
import { evaluatorService } from './evaluatorService';
import { roundService } from './roundService';
import { problemService } from './problemService';
import { MOCK_ACTIVITIES } from '../mock/activitiesData';

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
  private activities: ActivityFeedItem[] = [...MOCK_ACTIVITIES];

  public async getMetrics(): Promise<AdminMetrics> {
    const teams = await teamService.getAllTeams();
    const evaluators = await evaluatorService.getAllEvaluators();
    const activeRound = await roundService.getActiveRound();

    const totalParticipants = teams.reduce((acc, t) => acc + (t.members?.length || 1), 0);
    const totalAssignedEvals = evaluators.reduce((acc, e) => acc + e.assignedTeamIds.length, 0);
    const completedEvals = evaluators.reduce((acc, e) => acc + e.completedCount, 0);
    const pendingEvals = evaluators.reduce((acc, e) => acc + e.pendingCount, 0);

    const totalScores = teams.reduce((acc, t) => acc + t.totalScore, 0);
    const avg = teams.length > 0 ? Math.round(totalScores / teams.length) : 0;

    const completionRate = totalAssignedEvals > 0 ? Math.round((completedEvals / totalAssignedEvals) * 100) : 0;

    return {
      totalTeams: teams.length,
      totalParticipants,
      totalEvaluators: evaluators.length,
      activeRoundNumber: activeRound.number || activeRound.id,
      activeRoundName: activeRound.name,
      evaluationsCompleted: completedEvals,
      evaluationsPending: pendingEvals,
      completionRate,
      averageScore: avg,
    };
  }

  public async getActivities(): Promise<ActivityFeedItem[]> {
    return [...this.activities];
  }

  public async addActivity(act: Omit<ActivityFeedItem, 'id' | 'timestamp'>): Promise<void> {
    const newAct: ActivityFeedItem = {
      ...act,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
    };
    this.activities.unshift(newAct);
  }

  public async getProblemDistribution(): Promise<{ name: string; value: number }[]> {
    const teams = await teamService.getAllTeams();
    const problems = await problemService.getAllProblems();

    const counts: Record<string, number> = {};
    problems.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0);
    });

    teams.forEach((t) => {
      if (t.problemStatementId) {
        const p = problems.find((prob) => prob.id === t.problemStatementId);
        if (p) {
          counts[p.category] = (counts[p.category] || 0) + 1;
        }
      }
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }
}

export const adminService = new AdminService();
