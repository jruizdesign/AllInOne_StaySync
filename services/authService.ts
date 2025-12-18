import { User } from '../types';
import { systemService } from './systemService';

const STORAGE_KEY = 'staysync_user_session';

// Mock user for Demo Mode
const DEMO_USER: User = {
  uid: 'demo_admin',
  email: 'admin@staysync.com',
  displayName: 'Demo Admin',
  photoURL: null,
  role: 'SUPERUSER'
};

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. Check Demo Mode
      if (systemService.isDemoMode()) {
        // Accept any credentials in demo mode for convenience, or specific ones
        if (email === 'admin@staysync.com' || true) { 
           const user = { ...DEMO_USER };
           localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
           resolve(user);
           return;
        }
      }

      // 2. Check "Real" Local Users (simulated backend)
      const realUsers = systemService.getRealUsers();
      const validUser = realUsers.find(u => u.email === email && u.password === password);
      
      if (validUser) {
        const { password, ...userSafe } = validUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userSafe));
        resolve(userSafe);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
  return Promise.resolve();
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};
