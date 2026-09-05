import { Team } from '../types';
import { MOCK_TEAMS } from '../mock/teamsData';

class TeamService {
  private teams: Team[] = [];

  constructor() {
    this.loadTeams();
  }

  private loadTeams() {
    const cached = localStorage.getItem('gfg_teams_data');
    if (cached) {
      try {
        this.teams = JSON.parse(cached);
      } catch {
        this.teams = [...MOCK_TEAMS];
      }
    } else {
      this.teams = [...MOCK_TEAMS];
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem('gfg_teams_data', JSON.stringify(this.teams));
  }

  public getTeamsSync(): Team[] {
    return [...this.teams];
  }

  public async getAllTeams(): Promise<Team[]> {
    return [...this.teams];
  }

  public async getTeamById(id: string): Promise<Team | null> {
    const found = this.teams.find((t) => t.id === id);
    return found ? { ...found } : null;
  }

  public async getTeamByLeaderEmail(email: string): Promise<Team | null> {
    const clean = email.trim().toLowerCase();
    // Check internal store and mock array
    const found =
      this.teams.find((t) => t.leaderEmail.toLowerCase() === clean) ||
      MOCK_TEAMS.find((t) => t.leaderEmail.toLowerCase() === clean);
    return found ? { ...found } : null;
  }

  public async updateProblemSelection(teamId: string, problemId: string): Promise<Team> {
    const index = this.teams.findIndex((t) => t.id === teamId);
    if (index === -1) throw new Error(`Team ${teamId} not found`);

    this.teams[index] = {
      ...this.teams[index],
      problemStatementId: problemId,
      status: this.teams[index].photoUrl ? 'ROUND_1_EVAL' : 'PROBLEM_SELECTED',
    };
    this.persist();
    return { ...this.teams[index] };
  }

  public async uploadPhoto(teamId: string, photoUrl: string): Promise<Team> {
    const index = this.teams.findIndex((t) => t.id === teamId);
    if (index === -1) throw new Error(`Team ${teamId} not found`);

    this.teams[index] = {
      ...this.teams[index],
      photoUrl,
      status: this.teams[index].problemStatementId ? 'ROUND_1_EVAL' : 'PHOTO_UPLOADED',
    };
    this.persist();
    return { ...this.teams[index] };
  }

  public async updateRoundScore(teamId: string, roundId: number, score: number): Promise<Team> {
    const index = this.teams.findIndex((t) => t.id === teamId);
    if (index === -1) throw new Error(`Team ${teamId} not found`);

    const roundScores = { ...this.teams[index].roundScores, [roundId]: score };
    const totalScore = Object.values(roundScores).reduce((a, b) => a + b, 0);

    this.teams[index] = {
      ...this.teams[index],
      roundScores,
      totalScore,
    };

    // Re-calculate ranks
    this.recalculateRanks();
    this.persist();
    return { ...this.teams[index] };
  }

  private recalculateRanks() {
    this.teams.sort((a, b) => b.totalScore - a.totalScore);
    this.teams.forEach((team, idx) => {
      team.previousRank = team.rank || idx + 1;
      team.rank = idx + 1;
    });
  }

  public async importTeams(newTeams: Team[]): Promise<number> {
    newTeams.forEach((incoming) => {
      const existingIndex = this.teams.findIndex(
        (team) =>
          team.id.toLowerCase() === incoming.id.toLowerCase() ||
          team.leaderEmail.toLowerCase() === incoming.leaderEmail.toLowerCase()
      );

      if (existingIndex === -1) {
        this.teams.push(incoming);
        return;
      }

      const existing = this.teams[existingIndex];
      this.teams[existingIndex] = {
        ...existing,
        ...incoming,
        id: existing.id,
        problemStatementId: existing.problemStatementId || incoming.problemStatementId,
        photoUrl: existing.photoUrl || incoming.photoUrl,
        roundScores: existing.roundScores,
        totalScore: existing.totalScore,
        status: existing.status,
      };
    });
    this.recalculateRanks();
    this.persist();
    return newTeams.length;
  }

  public async resetData(): Promise<void> {
    this.teams = [...MOCK_TEAMS];
    this.persist();
  }
}

export const teamService = new TeamService();
