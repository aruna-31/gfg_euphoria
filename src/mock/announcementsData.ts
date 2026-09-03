import { Announcement } from '../types';

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Round 2 Evaluation Window is Currently Active',
    content: 'All teams must have their functional prototype running and ready for evaluation. Evaluators are visiting booths according to the assigned schedule.',
    timestamp: '2026-09-03T11:00:00Z',
    category: 'IMPORTANT',
    author: 'Chief Hackathon Director',
  },
  {
    id: 'ann-2',
    title: 'Group Photo Verification Deadline Reminder',
    content: 'Teams that have locked their problem statements are reminded to submit their verified team group photo before Round 2 closes.',
    timestamp: '2026-09-03T10:15:00Z',
    category: 'RULES',
    author: 'Operations Desk',
  },
  {
    id: 'ann-3',
    title: 'Mentorship Office Hours & Cloud Credits Support',
    content: 'AWS & Google Cloud mentors are stationed at Innovation Hall B for architecture guidance and infrastructure troubleshooting.',
    timestamp: '2026-09-03T09:30:00Z',
    category: 'SCHEDULE',
    author: 'Mentorship Committee',
  },
];
