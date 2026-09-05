import { ActivityFeedItem } from '../types';

export const MOCK_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 'act-1',
    type: 'EVALUATION_SUBMITTED',
    title: 'Round 2 Evaluation Submitted',
    description: 'Dr. Sundararajan Raman submitted evaluation for Team Vertex (Score: 90/100).',
    timestamp: '2 mins ago',
    actorName: 'Dr. Sundararajan Raman',
  },
  {
    id: 'act-2',
    type: 'PHOTO_UPLOADED',
    title: 'Team Photo Uploaded',
    description: 'Team Nova uploaded their official hackathon group photo.',
    timestamp: '14 mins ago',
    actorName: 'Karthik Subramanian',
  },
  {
    id: 'act-3',
    type: 'PROBLEM_SELECTED',
    title: 'Problem Statement Locked',
    description: 'Team Cipher selected Problem PS-003 (Fraud Graph Analytics).',
    timestamp: '32 mins ago',
    actorName: 'Aditya Varma',
  },
  {
    id: 'act-4',
    type: 'ROUND_STATUS_CHANGED',
    title: 'Round 2 Checkpoint Activated',
    description: 'Admin announced Round 2 evaluation slot window for all tracks.',
    timestamp: '1 hour ago',
    actorName: 'Hackathon Admin',
  },
  {
    id: 'act-5',
    type: 'EVALUATION_SUBMITTED',
    title: 'Batch Roster Validated',
    description: '8 official university teams successfully verified in the staging registry.',
    timestamp: '3 hours ago',
    actorName: 'Operations Director',
  },
];
