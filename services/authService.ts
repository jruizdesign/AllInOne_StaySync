import { User } from '../types';
// import { auth } from './firebaseConfig';
import { systemService } from './systemService';

// Mock user for demonstration until Firebase is fully configured
const MOCK_USER: User = {
  uid: 'user_123',
  email: 'admin@staysync.com',
  displayName: 'Demo Admin',
  photoURL: null,
  role: 'SUPERUSER'
};

export const login = async (email: string, password: string): Promise<User> => {
  // 1. Firebase Logic (Commented out)
  // if (auth) { ... }
  
  // 2. Demo Mode Logic
  if (systemService.isDemoMode()) {
    // In demo mode, accept generic admin login or just let them in
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER), 800);
    });
  }

  // 3. Live Mode Logic (Simulated Backend)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const realUsers = systemService.getRealUsers();
      const validUser = realUsers.find(u => u.email === email && u.password === password);
      
      if (validUser) {
        // Return user without password field
        const { password, ...userSafe } = validUser;
        resolve(userSafe);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};

export const logout = async (): Promise<void> => {
  // TODO: Uncomment when Firebase is configured
  // if (auth) {
  //   await firebaseSignOut(auth);
  // }
  return Promise.resolve();
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  // TODO: Uncomment when Firebase is configured
  // if (auth) { ... }
  
  // Persistence check
  const storedUser = localStorage.getItem('staysync_user');
  if (storedUser) {
    try {
       const parsed = JSON.parse(storedUser);
       // Verify if user still valid in current mode
       if (!systemService.isDemoMode()) {
           const realUsers = systemService.getRealUsers();
           const exists = realUsers.find(u => u.email === parsed.email);
           if (!exists) {
               callback(null);
               return () => {};
           }
       }
       callback(parsed);
    } catch(e) {
       callback(null);
    }
  } else {
    callback(null);
  }
  return () => {}; // Unsubscribe function
};