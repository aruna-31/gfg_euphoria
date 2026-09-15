import { Round } from '../types';

export const MOCK_ROUNDS: Round[] = [
  {
    id: 1,
    number: 1,
    name: 'Round 1: Idea Validation & Architecture Blueprint',
    title: 'Round 1: Idea Validation & Architecture Blueprint',
    description: 'Foundational checkpoint assessing problem definition, technical feasibility, system design, and database schema.',
    status: 'COMPLETED',
    startTime: '2026-09-02T10:00:00Z',
    endTime: '2026-09-02T18:00:00Z',
    maxScore: 100,
    instructions: [
      'Present your system architecture diagrams and API contracts.',
      'Explain your tech stack selection and scalability bottlenecks.',
      'Demonstrate your project repository and commit structure.',
    ],
    criteria: [
      { id: 'crit-round-1', title: 'Round 1 Evaluation Score', name: 'Round 1 Evaluation Score', description: 'Overall assessment of problem understanding, architecture, feasibility, and repository setup.', maxScore: 100 },
    ],
  },
  {
    id: 2,
    number: 2,
    name: 'Round 2: Functional Prototype & Edge Feasibility',
    title: 'Round 2: Functional Prototype & Edge Feasibility',
    description: 'Midway checkpoint evaluating working core features, code quality, and live interactive prototypes.',
    status: 'ACTIVE',
    startTime: '2026-09-03T09:00:00Z',
    endTime: '2026-09-03T18:00:00Z',
    maxScore: 100,
    instructions: [
      'Live execution of the primary user flow (zero mocked slides).',
      'Display active API integrations and database queries.',
      'Highlight error boundaries, edge cases, and test suites.',
    ],
    criteria: [
      { id: 'crit-round-2', title: 'Round 2 Evaluation Score', name: 'Round 2 Evaluation Score', description: 'Overall assessment of functional prototype execution, engineering quality, UI/UX polish, and jury Q&A.', maxScore: 100 },
    ],
  },
  {
    id: 3,
    number: 3,
    name: 'Round 3: Final Product Demo & Grand Defense',
    title: 'Round 3: Final Product Demo & Grand Defense',
    description: 'Grand finale evaluating production readiness, market viability, presentation, and edge polish.',
    status: 'UPCOMING',
    startTime: '2026-09-04T10:00:00Z',
    endTime: '2026-09-04T16:00:00Z',
    maxScore: 100,
    instructions: [
      'Final 5-minute pitch followed by 3-minute technical jury Q&A.',
      'Demonstrate deployed live URLs and stress-test performance.',
      'Present cost of operations and future roadmap.',
    ],
    criteria: [
      { id: 'crit-round-3', title: 'Round 3 Evaluation Score', name: 'Round 3 Evaluation Score', description: 'Overall assessment of complete product polish, impact, security, scalability, and grand pitch delivery.', maxScore: 100 },
    ],
  },
];
