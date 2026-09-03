import { Participant, Team, Announcement } from '../types';
import { MOCK_TEAMS } from '../mock/teamsData';
import { MOCK_ANNOUNCEMENTS } from '../mock/announcementsData';

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  status: 'COMPLETED' | 'LIVE' | 'UPCOMING';
  description: string;
}

export const MOCK_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'ev-1',
    time: 'Day 1 • 09:00 AM',
    title: 'Hackathon Inauguration & Keynote',
    location: 'Main Auditorium, KARE Campus',
    status: 'COMPLETED',
    description: 'Welcome address by Director, problem tracks briefing, and jury introduction.',
  },
  {
    id: 'ev-2',
    time: 'Day 1 • 11:30 AM',
    title: 'Problem Statement Selection Cutoff',
    location: 'Online Platform',
    status: 'COMPLETED',
    description: 'All teams lock in their chosen problem statement and upload verified team photos.',
  },
  {
    id: 'ev-3',
    time: 'Day 1 • 04:00 PM',
    title: 'Round 1: Idea Validation & Architectural Blueprint',
    location: 'Assigned Mentorship Labs',
    status: 'COMPLETED',
    description: 'Review of problem understanding, tech stack architecture, and system schema.',
  },
  {
    id: 'ev-4',
    time: 'Day 2 • 10:00 AM',
    title: 'Round 2: Functional Prototype & Feasibility Defense',
    location: 'Hackathon Arena / Booths',
    status: 'LIVE',
    description: 'Active jury evaluation of working core user journeys and live codebases.',
  },
  {
    id: 'ev-5',
    time: 'Day 2 • 04:00 PM',
    title: 'Round 3: Grand Finale & Valedictory Showcase',
    location: 'Main Auditorium Stage',
    status: 'UPCOMING',
    description: 'Top teams present final 5-minute pitches to senior industry jury.',
  },
];

class ParticipantService {
  public async getParticipantById(id: string): Promise<Participant | null> {
    for (const team of MOCK_TEAMS) {
      const member = team.members.find((m) => m.id === id);
      if (member) return { ...member };
    }
    return null;
  }

  public async getMyTeam(teamId: string): Promise<Team | null> {
    const cached = localStorage.getItem('gfg_teams_data');
    const teams: Team[] = cached ? JSON.parse(cached) : MOCK_TEAMS;
    const found = teams.find((t) => t.id === teamId);
    return found ? { ...found } : null;
  }

  public async getAnnouncements(): Promise<Announcement[]> {
    return [...MOCK_ANNOUNCEMENTS];
  }

  public async getSchedule(): Promise<ScheduleEvent[]> {
    return [...MOCK_SCHEDULE];
  }
}

export const participantService = new ParticipantService();
