import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: 'pelu-harliz-green-df830',
  appId: '1:437514694034:web:82dba50042406d4199254b',
  storageBucket: 'pelu-harliz-green-df830.firebasestorage.app',
  apiKey: 'AIzaSyBjkzLm8xiOXGwDyc7yljAhXjarw5b7Sw8',
  authDomain: 'pelu-harliz-green-df830.firebaseapp.com',
  messagingSenderId: '437514694034',
  measurementId: 'G-XJC9DJD71X'
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);
