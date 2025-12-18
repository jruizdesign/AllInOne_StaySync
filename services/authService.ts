import { User } from '../types';
import { auth } from './firebaseConfig';
// import { 
//   signInWithEmailAndPassword, 
//   signOut as firebaseSignOut,
//   onAuthStateChanged as firebaseOnAuthStateChanged,
//   User as FirebaseUser
// } from 'firebase/auth';

// Mock user for demonstration until Firebase is fully configured
const MOCK_USER: User = {
  uid: 'user_123',
  email: 'admin@staysync.com',
  displayName: 'Admin User',
  photoURL: null
};

export const login = async (email: string, password: string): Promise<User> => {
  // TODO: Uncomment when Firebase is configured
  // if (auth) {
  //   const userCredential = await signInWithEmailAndPassword(auth!, email, password);
  //   return mapFirebaseUser(userCredential.user);
  // }
  
  // Mock login simulation
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USER), 800);
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
  // if (auth) {
  //   return firebaseOnAuthStateChanged(auth, (user) => {
  //     callback(user ? mapFirebaseUser(user) : null);
  //   });
  // }
  
  // Mock persistence check for demo
  const storedUser = localStorage.getItem('staysync_user');
  if (storedUser) {
    try {
       callback(JSON.parse(storedUser));
    } catch(e) {
       callback(null);
    }
  } else {
    callback(null);
  }
  return () => {}; // Unsubscribe function
};

// const mapFirebaseUser = (user: FirebaseUser): User => ({
//   uid: user.uid,
//   email: user.email,
//   displayName: user.displayName,
//   photoURL: user.photoURL
// });