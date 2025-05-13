import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { getUserFromToken, removeToken, setToken } from '../utils/tokenUtils';

type User = {
  username: string;
  role: 'ORGANIZER' | 'ATTENDEE';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: 'ORGANIZER' | 'ATTENDEE') => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const userData = getUserFromToken();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser({ username, password });
      setToken(data.token);
      const userData = getUserFromToken();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, role: 'ORGANIZER' | 'ATTENDEE') => {
    try {
      setLoading(true);
      setError(null);
      const data = await registerUser({ username, password, role });
      setToken(data.token);
      const userData = getUserFromToken();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;