import { User, UserRole } from '../types';
import { MOCK_TEAMS } from '../mock/teamsData';
import { MOCK_EVALUATORS } from '../mock/evaluatorsData';

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  teamId?: string;
  evaluatorId?: string;
  iat: number;
  exp: number;
  iss: string;
}

export const DEMO_CREDENTIALS = [
  { label: 'Team Leader (Team Vertex)', email: 'aarav.sharma@iitm.ac.in', password: 'leader123', role: 'LEADER' },
  { label: 'Team Leader (Team Nova)', email: 'karthik.s@klu.ac.in', password: 'leader123', role: 'LEADER' },
  { label: 'Jury / Evaluator', email: 'dr.aravind@kare.edu.in', password: 'eval123', role: 'EVALUATOR' },
  { label: 'Operations Admin', email: 'admin@gfgkare.in', password: 'admin123', role: 'ADMIN' },
];

class AuthService {
  private currentUser: User | null = null;
  private tokenKey = 'gfg_jwt_token';
  private userKey = 'gfg_auth_user';

  constructor() {
    const cachedToken = localStorage.getItem(this.tokenKey);
    const cachedUser = localStorage.getItem(this.userKey);

    if (cachedToken && cachedUser) {
      try {
        const payload = this.decodeJWT(cachedToken);
        if (payload && payload.exp > Math.floor(Date.now() / 1000)) {
          this.currentUser = JSON.parse(cachedUser);
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    } else {
      this.currentUser = null;
    }
  }

  private createJWT(user: User): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      evaluatorId: user.evaluatorId,
      iat: now,
      exp: now + 86400,
      iss: 'gfg-kare-euphoria-auth',
    };

    const base64UrlEncode = (obj: object) => {
      const json = JSON.stringify(obj);
      return btoa(json).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    const headerEncoded = base64UrlEncode(header);
    const payloadEncoded = base64UrlEncode(payload);
    const signature = btoa(`kare_sig_${headerEncoded}.${payloadEncoded}`)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  public decodeJWT(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  public async login(email: string, pass: string): Promise<User> {
    const clean = email.trim().toLowerCase();
    if (clean.includes('admin')) {
      return this.loginAsAdmin(clean, pass);
    }
    const isEval = MOCK_EVALUATORS.some((e) => e.email.toLowerCase() === clean);
    if (isEval) {
      return this.loginAsEvaluator(clean, pass);
    }
    return this.loginAsLeader(clean, pass);
  }

  // 1. Team Leader Login
  public async loginAsLeader(email: string, _pass: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 600));
    const cleanEmail = email.trim().toLowerCase();

    const team = MOCK_TEAMS.find((t) => t.leaderEmail.toLowerCase() === cleanEmail);
    if (!team) {
      throw new Error(`No registered team found with Leader email: "${cleanEmail}". Only registered Team Leader emails can authenticate.`);
    }

    const user: User = {
      id: `usr-lead-${team.id}`,
      email: team.leaderEmail,
      name: team.leaderName,
      role: 'LEADER',
      teamId: team.id,
      college: team.college,
      avatarUrl: team.photoUrl,
    };

    const token = this.createJWT(user);
    this.setSession(user, token);
    return user;
  }

  // 2. Evaluator Login
  public async loginAsEvaluator(email: string, _pass: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 600));
    const cleanEmail = email.trim().toLowerCase();

    const evaluator = MOCK_EVALUATORS.find((e) => e.email.toLowerCase() === cleanEmail);
    if (!evaluator) {
      throw new Error(`Jury credentials not found for: "${cleanEmail}". Check with Hackathon Operations.`);
    }

    const user: User = {
      id: `usr-eval-${evaluator.id}`,
      email: evaluator.email,
      name: evaluator.name,
      role: 'EVALUATOR',
      evaluatorId: evaluator.id,
      college: evaluator.organization,
      avatarUrl: evaluator.avatarUrl,
    };

    const token = this.createJWT(user);
    this.setSession(user, token);
    return user;
  }

  // 3. Admin Login
  public async loginAsAdmin(email: string, pass: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 600));
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== 'admin@gfgkare.in' && !cleanEmail.startsWith('admin')) {
      throw new Error('Unauthorized: Admin portal access requires an authorized administrator credential.');
    }

    const user: User = {
      id: 'usr-admin-01',
      email: cleanEmail,
      name: 'Operations Director',
      role: 'ADMIN',
      college: 'KARE Hackathon Directorate',
    };

    const token = this.createJWT(user);
    this.setSession(user, token);
    return user;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
  }

  private setSession(user: User, token: string) {
    this.currentUser = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
  }
}

export const authService = new AuthService();
