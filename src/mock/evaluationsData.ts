import { Evaluation } from '../types';

export const MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-rec-001',
    roundId: 1,
    teamId: 'TEAM-001',
    evaluatorId: 'eval-1',
    scores: {
      'crit-innov': 19,
      'crit-tech': 24,
      'crit-prob': 14,
      'crit-feas': 14,
      'crit-pres': 14,
      'crit-impact': 9,
    },
    totalScore: 94,
    feedback: 'Outstanding architectural clarity. The quantized edge TFLite model on Raspberry Pi demo was crisp with under 80ms inference latency.',
    strengths: 'Clear domain knowledge of vernacular Indian crop varieties and modular offline cache.',
    improvements: 'Expand testing on damaged camera lens artifacts.',
    submittedAt: '2026-09-03T11:30:00Z',
    evaluatedAt: '2026-09-03T11:30:00Z',
    status: 'SUBMITTED',
  },
];
