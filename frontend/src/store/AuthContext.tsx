/**
 * BuildFlow ERP — Auth Context & Provider
 * 
 * Per react-state-management skill: React Context for client state (auth/theme).
 * Per react-patterns skill: Custom hooks for clean API.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import type { LoginRequest, User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login for offline demo
  useEffect(() => {
    setTimeout(() => {
      setUser({
        id: '123',
        email: 'admin@buildflow.com',
        full_name: 'Demo Admin',
        role: 'admin',
        is_active: true
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const me: User = {
      id: '123',
      email: data.email,
      full_name: 'Demo Admin',
      role: 'admin',
      is_active: true
    };
    setUser(me);
    message.success(`Welcome back, ${me.full_name}!`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    message.info('You have been logged out');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
