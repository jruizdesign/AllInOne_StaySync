import { User, Role } from '../types';

const STORAGE_KEYS = {
  IS_DEMO_MODE: 'staysync_is_demo',
  SETUP_COMPLETE: 'staysync_setup_complete',
  REAL_USERS: 'staysync_real_users',
};

// Default Mock Superuser
const MOCK_SUPERUSER: User = {
  uid: 'mock_superuser',
  email: 'admin@staysync.com',
  displayName: 'Demo Admin',
  photoURL: null,
  role: 'SUPERUSER'
};

const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to parse ${key}, resetting to fallback.`);
    localStorage.removeItem(key);
    return fallback;
  }
};

export const systemService = {
  isDemoMode: (): boolean => {
    // Default to true if not set or error
    return safeParse(STORAGE_KEYS.IS_DEMO_MODE, true);
  },

  setDemoMode: (isDemo: boolean) => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO_MODE, JSON.stringify(isDemo));
    if (isDemo) {
        // If switching back to demo, setup is conceptually "done" for the demo environment
        localStorage.setItem(STORAGE_KEYS.SETUP_COMPLETE, 'true');
    } else {
        // If switching to Live, check if we have users, if not, setup is false
        const users = systemService.getRealUsers();
        if (users.length === 0) {
            localStorage.setItem(STORAGE_KEYS.SETUP_COMPLETE, 'false');
        }
    }
  },

  isSetupComplete: (): boolean => {
    if (systemService.isDemoMode()) return true;
    const stored = localStorage.getItem(STORAGE_KEYS.SETUP_COMPLETE);
    return stored === 'true';
  },

  completeSetup: () => {
    localStorage.setItem(STORAGE_KEYS.SETUP_COMPLETE, 'true');
  },

  // User Management for "Live" Mode
  getRealUsers: (): (User & { password?: string })[] => {
    return safeParse(STORAGE_KEYS.REAL_USERS, []);
  },

  saveRealUser: (user: User, password?: string) => {
    const users = systemService.getRealUsers();
    // Remove existing if updating
    const filtered = users.filter(u => u.email !== user.email && u.role !== user.role);
    filtered.push({ ...user, password }); // In a real app, never store passwords in localstorage. This is for the "Live" simulation.
    localStorage.setItem(STORAGE_KEYS.REAL_USERS, JSON.stringify(filtered));
  },

  resetRealUsers: () => {
      localStorage.removeItem(STORAGE_KEYS.REAL_USERS);
  }
};