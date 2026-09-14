import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, RegisterLeaderPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  registerLeader: (payload: RegisterLeaderPayload) => Promise<User>;
  loginAsLeader: (email: string, pass: string) => Promise<User>;
  loginAsEvaluator: (email: string, pass: string) => Promise<User>;
  loginAsAdmin: (email: string, pass: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const logged = await authService.login(email, pass);
      setUser(logged);
      return logged;
    } finally {
      setIsLoading(false);
    }
  };

  const registerLeader = async (payload: RegisterLeaderPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const registered = await authService.registerLeader(payload);
      setUser(registered);
      return registered;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsLeader = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const logged = await authService.loginAsLeader(email, pass);
      setUser(logged);
      return logged;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsEvaluator = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const logged = await authService.loginAsEvaluator(email, pass);
      setUser(logged);
      return logged;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const logged = await authService.loginAsAdmin(email, pass);
      setUser(logged);
      return logged;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        registerLeader,
        loginAsLeader,
        loginAsEvaluator,
        loginAsAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
