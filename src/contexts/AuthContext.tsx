import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'end_user' | 'support_agent' | 'admin';
  department: string;
  picture?: string;
  active: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  handleGoogleSignIn: (credential: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp > Date.now() / 1000) {
          setCurrentUser({
            id: payload.userId,
            username: payload.username,
            name: payload.name || payload.username,
            email: payload.email || '',
            role: payload.role,
            department: payload.department || 'General',
            active: true
          });
        } else {
          localStorage.removeItem('auth-token');
        }
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.removeItem('auth-token');
      }
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('active', true)
      .maybeSingle();

    if (error || !users) {
      return false;
    }

    const token = createToken(users);
    localStorage.setItem('auth-token', token);
    setCurrentUser(users);
    return true;
  };

  const handleGoogleSignIn = async (credential: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('auth-token', data.token);
        setCurrentUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setCurrentUser(null);
  };

  const createToken = (user: User) => {
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }));
    return `${header}.${payload}.signature`;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, handleGoogleSignIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
