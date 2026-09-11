export type UserRole = 'LEADER' | 'EVALUATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string; // For LEADER
  evaluatorId?: string; // For EVALUATOR
  avatarUrl?: string;
  college?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  teamId: string;
  isLeader: boolean;
  roleInTeam: string;
  github?: string;
  linkedin?: string;
}

export type TeamStatus =
  | 'REGISTERED'
  | 'PROBLEM_SELECTED'
  | 'PHOTO_UPLOADED'
  | 'ROUND_1_EVAL'
  | 'ROUND_2_EVAL'
  | 'FINAL_EVAL'
  | 'COMPLETED';

export interface Team {
  id: string;
  name: string;
  college: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  accessPassword?: string;
  members: Participant[];
  problemStatementId?: string;
  photoUrl?: string;
  currentRound: number;
  totalScore: number;
  roundScores: Record<number, number>;
  status: TeamStatus;
  rank?: number;
  previousRank?: number;
  createdAt: string;
}

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface ProblemStatement {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  shortDescription: string;
  fullDescription: string;
  problemOwner: string;
  deliverables: string[];
  evaluationFocus: string[];
  selectedByCount: number;
  maxCapacity: number;
}

export type RoundStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

export interface EvaluationCriterion {
  id: string;
  title: string;
  name?: string;
  description: string;
  maxScore: number;
}

export interface Round {
  id: number;
  number: number;
  name: string;
  title?: string;
  description: string;
  status: RoundStatus;
  startTime: string;
  endTime: string;
  maxScore: number;
  instructions: string[];
  criteria: EvaluationCriterion[];
}

export interface ScoreDetail {
  criterionId: string;
  score: number;
  comments?: string;
}

export interface Evaluation {
  id: string;
  teamId: string;
  evaluatorId: string;
  roundId: number;
  scores: any;
  totalScore: number;
  feedback: string;
  strengths?: string;
  improvements?: string;
  evaluatedAt: string;
  submittedAt?: string;
  status?: string;
}

export interface Evaluator {
  id: string;
  name: string;
  email: string;
  designation: string;
  organization: string;
  expertise: string[];
  assignedTeamIds: string[];
  assignedRounds: number[];
  assignedProblemStatementIds?: string[];
  completedCount: number;
  pendingCount: number;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  accessPassword?: string;
}

export interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  teamId: string;
  teamName: string;
  college: string;
  leaderName?: string;
  photoUrl?: string;
  problemStatementId?: string;
  problemTitle?: string;
  roundScores: Record<number, number>;
  totalScore: number;
  currentRound?: number;
  status?: TeamStatus;
}

export interface CSVValidationIssue {
  row: number;
  field: string;
  value: string;
  issue: string;
  severity: 'ERROR' | 'WARNING';
}

export interface CSVImportResult {
  totalRows: number;
  validRows: number;
  invalidRows?: number;
  errorCount?: number;
  warningCount?: number;
  issues: CSVValidationIssue[];
  validTeams?: Team[];
  previewData?: any[];
  fileName?: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
  teamId?: string;
  actorName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  category: 'SCHEDULE' | 'RULES' | 'IMPORTANT';
  author: string;
}

export interface NotificationItem {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'ALERT';
  title?: string;
  message: string;
  timestamp: string;
  read?: boolean;
  link?: string;
}
