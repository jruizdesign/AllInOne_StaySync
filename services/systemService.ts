import { User, Role, Room, RoomStatus } from '../types';

const STORAGE_KEYS = {
  IS_DEMO_MODE: 'staysync_is_demo',
  SETUP_COMPLETE: 'staysync_setup_complete',
  REAL_USERS: 'staysync_real_users',
  REAL_ROOMS: 'staysync_real_rooms',
};

// Default Mock Superuser
const MOCK_SUPERUSER: User = {
  uid: 'mock_superuser',
  email: 'admin@staysync.com',
  displayName: 'Demo Admin',
  photoURL: null,
  role: 'SUPERUSER'
};

export const systemService = {
  isDemoMode: (): boolean => {
    const stored = localStorage.getItem(STORAGE_KEYS.IS_DEMO_MODE);
    return stored === null ? true : JSON.parse(stored);
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
    const stored = localStorage.getItem(STORAGE_KEYS.REAL_USERS);
    return stored ? JSON.parse(stored) : [];
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
  },

  // Room Management for "Live" Mode
  getRealRooms: (): Room[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.REAL_ROOMS);
    return stored ? JSON.parse(stored) : [];
  },

  saveRealRooms: (rooms: Room[]) => {
    localStorage.setItem(STORAGE_KEYS.REAL_ROOMS, JSON.stringify(rooms));
  },
};