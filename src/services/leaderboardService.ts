import { LeaderboardEntry } from '../types';
import { teamService } from './teamService';
import { problemService } from './problemService';

class LeaderboardService {
  private readonly listeners = new Set<() => void>();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notifySubscribers(): void {
    this.listeners.forEach((listener) => listener());
  }

  public async getLeaderboard(roundFilter: 'all' | 1 | 2 | 3 = 'all'): Promise<LeaderboardEntry[]> {
    const teams = await teamService.getAllTeams();
    const problems = await problemService.getAllProblems();

    const problemMap = new Map(problems.map((p) => [p.id, p.title]));

    const scoreFor = (team: (typeof teams)[number], round: 'all' | 1 | 2 | 3) => {
      if (round === 'all') return team.totalScore || 0;
      return (team.roundScores && team.roundScores[round]) || (team.currentRound === round ? team.totalScore : 0) || 0;
    };

    const previousRound = roundFilter === 'all' || roundFilter === 1
      ? 'all'
      : ((roundFilter - 1) as 1 | 2 | 3);
    const previousRanks = new Map(
      [...teams]
        .sort((a, b) => scoreFor(b, previousRound) - scoreFor(a, previousRound))
        .map((team, index) => [team.id, index + 1])
    );

    const entries: LeaderboardEntry[] = teams.map((team) => {
      let score = team.totalScore || 0;
      if (roundFilter !== 'all') {
        score = (team.roundScores && team.roundScores[roundFilter]) || (team.currentRound === roundFilter ? team.totalScore : 0) || 0;
      }

      return {
        rank: 0,
        previousRank: previousRanks.get(team.id) || team.previousRank || 1,
        teamId: team.id,
        teamName: team.name,
        college: team.college,
        leaderName: team.leaderName,
        photoUrl: team.photoUrl,
        problemStatementId: team.problemStatementId,
        problemTitle: team.problemStatementId ? problemMap.get(team.problemStatementId) || 'Selected Problem' : 'Problem Pending',
        roundScores: team.roundScores || { 1: team.totalScore || 0 },
        totalScore: team.totalScore || score,
        status: team.status,
      };
    });

    // Sort descending by score
    entries.sort((a, b) => b.totalScore - a.totalScore);

    // Assign final ranks
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
      if (roundFilter === 1 && !entry.previousRank) entry.previousRank = entry.rank;
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
      this.notifySubscribers();
    }
    return this.getLeaderboard('all');
  }
}

export const leaderboardService = new LeaderboardService();
