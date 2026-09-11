import { Team } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class TeamService {
  public async getAllTeams(): Promise<Team[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/teams`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public async getTeamById(id: string): Promise<Team | null> {
    if (!id) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }
    const all = await this.getAllTeams();
    const clean = id.trim().toLowerCase();
    return all.find((t) => t.id.toLowerCase() === clean || t.leaderEmail.toLowerCase() === clean) || null;
  }

  public async getTeamByLeaderEmail(email: string): Promise<Team | null> {
    if (!email) return null;
    return this.getTeamById(email.trim().toLowerCase());
  }

  public async updateProblemSelection(teamId: string, problemId: string): Promise<Team> {
    const res = await fetch(`${API_BASE_URL}/problems/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: teamId, problem_id: problemId }),
    });

    if (res.status === 409) {
      throw new Error('Conflict: Problem statement has already been selected and cannot be changed.');
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to lock problem selection.');
    }

    const updatedTeam = await this.getTeamById(teamId);
    if (!updatedTeam) {
      throw new Error('Team not found after update.');
    }
    return updatedTeam;
  }

  public async uploadPhoto(teamId: string, photoUrl: string): Promise<Team> {
    const res = await fetch(`${API_BASE_URL}/teams/${encodeURIComponent(teamId)}/photo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_url: photoUrl }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to save squad photo to database.');
    }

    const data = await res.json();
    return data;
  }

  public async updateRoundScore(teamId: string, roundId: number, score: number): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: teamId,
          evaluator_id: 'usr-admin-1',
          round_id: roundId,
          scores: { total: score },
          total_score: score,
          feedback: 'Evaluated',
        }),
      });
    } catch {
      // ignore
    }
  }

  public async importTeams(teams: Team[]): Promise<number> {
    return Promise.resolve(teams.length);
  }
}

export const teamService = new TeamService();
