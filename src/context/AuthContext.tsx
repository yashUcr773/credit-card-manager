'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';

const AUTH_STORAGE_KEY = 'ccm_auth';
const USER_STORAGE_KEY = 'ccm_user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedAuth && storedUser) {
        const authData = JSON.parse(storedAuth);
        const userData = JSON.parse(storedUser);

        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - authData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge < maxAge) {
          return {
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          };
        } else {
          // Session expired
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return { user: null, isAuthenticated: false, isLoading: false };
        }
      }
      return { user: null, isAuthenticated: false, isLoading: false };
    };

    setState(checkSession());
  }, []);

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedHash = localStorage.getItem(`${USER_STORAGE_KEY}_hash`);

    if (!storedUser || !storedHash) {
      return false;
    }

    const userData: User = JSON.parse(storedUser);
    const passwordHash = await hashPassword(password);

    if (userData.email === email && storedHash === passwordHash) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (existingUser) {
      // User already exists
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    const passwordHash = await hashPassword(password);

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(`${USER_STORAGE_KEY}_hash`, passwordHash);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));

    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!state.user) return;

    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setState((prev) => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
