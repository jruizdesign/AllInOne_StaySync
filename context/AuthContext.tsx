import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { login, logout, subscribeToAuthChanges } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (e: string, p: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const u = await login(email, pass);
      setUser(u);
      localStorage.setItem('staysync_user', JSON.stringify(u)); // Simple persistence for mock
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('staysync_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
