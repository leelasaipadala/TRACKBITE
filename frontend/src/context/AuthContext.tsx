import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  weight?: number;
  goalWeight?: number;
}

export const DEMO_USER: User = {
  id: 'demo-user-id',
  name: 'Alex Morgan',
  email: 'alex.morgan@trackbite.demo',
  role: 'demo',
  weight: 68,
  goalWeight: 62,
};

interface AuthContextType {
  user: User | null;
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  token: string | null;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return sessionStorage.getItem('trackbite_demo_mode') === 'true';
  });

  useEffect(() => {
    if (isDemoMode) {
      setUser(DEMO_USER);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [isDemoMode]);

  const enterDemoMode = () => {
    sessionStorage.setItem('trackbite_demo_mode', 'true');
    setIsDemoMode(true);
    setUser(DEMO_USER);
  };

  const exitDemoMode = () => {
    sessionStorage.removeItem('trackbite_demo_mode');
    localStorage.removeItem('trackbite_demo_mode');
    setIsDemoMode(false);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  const login = (nextUser: User, nextToken: string) => {
    sessionStorage.removeItem('trackbite_demo_mode');
    localStorage.removeItem('trackbite_demo_mode');
    setIsDemoMode(false);
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.setItem('token', nextToken);
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = () => {
    sessionStorage.removeItem('trackbite_demo_mode');
    localStorage.removeItem('trackbite_demo_mode');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsDemoMode(false);
    setUser(null);
    setToken(null);
  };

  const updateUser = (nextUser: User) => {
    if (!isDemoMode) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    }
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({ user, isDemoMode, enterDemoMode, exitDemoMode, login, logout, token, updateUser }),
    [user, isDemoMode, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

