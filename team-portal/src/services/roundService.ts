import { Round, RoundStatus } from '../types';
import { MOCK_ROUNDS } from '../mock/roundsData';

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
    return [...this.rounds];
  }

  public async getRoundById(id: number): Promise<Round | null> {
    const found = this.rounds.find((r) => r.id === id);
    return found ? { ...found } : null;
  }

  public async getActiveRound(): Promise<Round> {
    const active = this.rounds.find((r) => r.status === 'ACTIVE');
    return active || this.rounds[1] || this.rounds[0];
  }

  public async updateRoundStatus(roundId: number, status: RoundStatus): Promise<Round> {
    const idx = this.rounds.findIndex((r) => r.id === roundId);
    if (idx === -1) throw new Error(`Round ${roundId} not found`);

    if (status === 'ACTIVE') {
      this.rounds = this.rounds.map((round, roundIndex) => ({
        ...round,
        status: roundIndex === idx ? 'ACTIVE' : round.status === 'ACTIVE' ? 'COMPLETED' : round.status,
      }));
    } else {
      this.rounds[idx] = { ...this.rounds[idx], status };
    }
    this.persist();
    return { ...this.rounds[idx] };
  }
}

export const roundService = new RoundService();
