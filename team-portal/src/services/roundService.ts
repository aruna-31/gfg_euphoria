import { Round, RoundStatus } from '../types';
import { MOCK_ROUNDS } from '../mock/roundsData';
import { API_BASE_URL } from './apiConfig';

class RoundService {
  private rounds: Round[] = [];

  constructor() {
    const cached = localStorage.getItem('gfg_rounds_data');
    if (cached) {
      try {
        this.rounds = JSON.parse(cached);
      } catch {
        this.rounds = [...MOCK_ROUNDS];
      }
    } else {
      this.rounds = [...MOCK_ROUNDS];
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem('gfg_rounds_data', JSON.stringify(this.rounds));
  }

  public async getAllRounds(): Promise<Round[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/rounds`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.rounds = data.map((r: any) => ({
            id: r.id,
            number: r.number || r.id,
            name: r.name || r.title,
            title: r.title || r.name,
            description: r.description,
            status: r.status as RoundStatus,
            startTime: r.startTime || r.start_time || new Date().toISOString(),
            endTime: r.endTime || r.end_time || new Date().toISOString(),
            maxScore: Number(r.maxScore || r.max_score) || 100,
            instructions: r.instructions || [],
            criteria: Array.isArray(r.criteria) && r.criteria.length > 0
              ? r.criteria.map((c: any) => ({
                  id: c.id || `crit-${r.id}`,
                  title: c.title || c.name || 'Overall Evaluation Score',
                  name: c.name || c.title || 'Overall Evaluation Score',
                  maxScore: Number(c.maxScore ?? c.maxPoints ?? c.max_score) || 100,
                  description: c.description || 'Evaluation score for this checkpoint.',
                }))
              : [
                  {
                    id: `crit-${r.id}`,
                    title: 'Overall Evaluation Score',
                    name: 'Overall Evaluation Score',
                    maxScore: Number(r.maxScore || r.max_score) || 100,
                    description: 'Comprehensive evaluation score for this checkpoint.',
                  },
                ],
          }));
          this.persist();
        }
      }
    } catch {
      // Fallback to local cached rounds if offline
    }
    return [...this.rounds];
  }

  public async getRoundById(id: number): Promise<Round | null> {
    const all = await this.getAllRounds();
    const found = all.find((r) => r.id === id);
    return found ? { ...found } : null;
  }

  public async getActiveRound(): Promise<Round | null> {
    const all = await this.getAllRounds();
    const active = all.find((r) => r.status === 'ACTIVE');
    return active ? { ...active } : null;
  }

  public async updateRoundStatus(roundId: number, status: RoundStatus): Promise<Round> {
    // 1. Update in backend API
    try {
      await fetch(`${API_BASE_URL}/rounds/${roundId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Backend round update failed, updating locally:', err);
    }

    // 2. Update local state
    const idx = this.rounds.findIndex((r) => r.id === roundId);
    if (idx !== -1) {
      if (status === 'ACTIVE') {
        this.rounds = this.rounds.map((round, roundIndex) => ({
          ...round,
          status: roundIndex === idx ? 'ACTIVE' : round.status === 'ACTIVE' ? 'COMPLETED' : round.status,
        }));
      } else {
        this.rounds[idx] = { ...this.rounds[idx], status };
      }
      this.persist();
    }

    // Refetch latest from server if possible
    await this.getAllRounds();
    const updated = this.rounds.find((r) => r.id === roundId);
    return updated ? { ...updated } : this.rounds[idx];
  }
}

export const roundService = new RoundService();
