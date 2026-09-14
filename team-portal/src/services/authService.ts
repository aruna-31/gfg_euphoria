import { User, UserRole } from '../types';
import { API_BASE_URL } from './apiConfig';

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

export interface RegisterLeaderPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  college: string;
  team_name: string;
  member2_name?: string;
  member2_email?: string;
  member2_role?: string;
  member3_name?: string;
  member3_email?: string;
  member3_role?: string;
}


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

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    if (!this.currentUser) return false;
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeJWT(token);
    return Boolean(payload && payload.exp > Math.floor(Date.now() / 1000));
  }

  // --- API Authentication Methods ---

  public async registerLeader(payload: RegisterLeaderPayload): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register-leader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Registration failed.');
      }

      const data = await res.json();
      const token = data.access_token;
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'LEADER',
        college: data.user.college,
        teamId: data.user.teamId,
      };

      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
      this.currentUser = user;

      return user;
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error('Registration failed.');
    }
  }

  public async loginAsLeader(email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-leader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: 'LEADER',
          college: data.user.college,
          teamId: data.user.teamId,
        };

        localStorage.setItem(this.tokenKey, data.access_token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser = user;
        return user;
      }
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error('Team Leader login failed.');
    }

    throw new Error('Authentication failed. Verify your registered Team Leader email and password.');
  }

  public async login(email: string, password: string): Promise<User> {
    return this.loginAsLeader(email, password);
  }

  public async loginAsEvaluator(email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-evaluator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: 'EVALUATOR',
          college: data.user.college,
          evaluatorId: data.user.id,
        };

        localStorage.setItem(this.tokenKey, data.access_token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser = user;
        return user;
      }
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error('Evaluator login failed.');
    }

    throw new Error('Authentication failed. Verify your evaluator email and password.');
  }

  public async loginAsAdmin(email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: 'ADMIN',
          college: data.user.college,
        };

        localStorage.setItem(this.tokenKey, data.access_token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser = user;
        return user;
      }
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error('Administrator login failed.');
    }

    throw new Error('Authentication failed. Verify your administrator email and password.');
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser = null;
  }
}

export const authService = new AuthService();

