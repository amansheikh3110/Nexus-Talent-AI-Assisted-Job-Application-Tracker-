import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
  email: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (storedToken && storedEmail) {
      setToken(storedToken);
      // Initialize with email, then refetch full profile
      setUser({ email: storedEmail });
      refetchUser(storedToken);
    }
    setIsLoading(false);
  }, []);

  const refetchUser = async (explicitToken?: string) => {
    const activeToken = explicitToken || token;
    if (!activeToken) return;

    try {
      const { data } = await api.get('/user/me');
      setUser(data);
    } catch (err) {
      console.error("Failed to refetch user", err);
    }
  };

  const login = (newToken: string, email: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', email);
    setToken(newToken);
    setUser({ email });
    refetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
