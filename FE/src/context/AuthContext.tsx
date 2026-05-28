import React, { createContext, useState, useContext } from 'react';
import type { AuthResponse } from '../types/auth.ts';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoggedIn: boolean;
  pendingPrompt: string | null;
  setPendingPrompt: (p: string | null) => void;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const login = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, pendingPrompt, setPendingPrompt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};