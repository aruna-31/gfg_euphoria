import { LeaderboardEntry } from '../types';
import { teamService } from './teamService';
import { problemService } from './problemService';

class LeaderboardService {
  public async getLeaderboard(roundFilter: 'all' | 1 | 2 | 3 = 'all'): Promise<LeaderboardEntry[]> {
    const teams = await teamService.getAllTeams();
    const problems = await problemService.getAllProblems();

    const problemMap = new Map(problems.map((p) => [p.id, p.title]));

    const entries: LeaderboardEntry[] = teams.map((team) => {
      let score = team.totalScore;
      if (roundFilter !== 'all') {
        score = team.roundScores[roundFilter] || 0;
      }

      return {
        rank: 0,
        previousRank: team.previousRank || 0,
        teamId: team.id,
        teamName: team.name,
        college: team.college,
        leaderName: team.leaderName,
        photoUrl: team.photoUrl,
        problemStatementId: team.problemStatementId,
        problemTitle: team.problemStatementId ? problemMap.get(team.problemStatementId) || 'Selected Problem' : 'Problem Pending',
        roundScores: team.roundScores,
        totalScore: score,
        status: team.status,
      };
    });

    // Sort descending by score
    entries.sort((a, b) => b.totalScore - a.totalScore);

    // Assign final ranks
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
      if (!entry.previousRank) entry.previousRank = entry.rank;
    });

    return entries;
  }

  // Live simulation tick: adjust scores slightly to show animated rank movements
  public async simulateLiveShift(): Promise<LeaderboardEntry[]> {
    const teams = await teamService.getAllTeams();
    if (teams.length >= 4) {
      // randomly pick a team from ranks 2-5 and give them a 2-point boost
      const targetTeam = teams[Math.floor(Math.random() * 4) + 1];
      const currentRound = targetTeam.currentRound || 2;
      const currentScore = targetTeam.roundScores[currentRound] || 85;
      await teamService.updateRoundScore(targetTeam.id, currentRound, Math.min(99, currentScore + 2));
    }
    return this.getLeaderboard('all');
  }
}

export const leaderboardService = new LeaderboardService();
