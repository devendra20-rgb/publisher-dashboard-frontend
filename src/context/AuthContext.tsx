import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import type { ApiResponse, User } from '../types';

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener('auth-expired', expire);
    if (localStorage.getItem('token')) {
      api.get<ApiResponse<User>>('/auth/me')
        .then(({ data }) => {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
    return () => window.removeEventListener('auth-expired', expire);
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    loading,
    login: async (email, password) => {
      const { data } = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      setUser(data.data.user);
      return data.data.user;
    },
    logout: async () => {
      try { await api.post('/auth/logout'); } catch { /* local logout still succeeds */ }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
