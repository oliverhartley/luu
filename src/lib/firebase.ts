import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: 'pelu-harliz-green',
  appId: '1:217318402011:web:b660dcacfb27c4badde9fe',
  storageBucket: 'pelu-harliz-green.firebasestorage.app',
  apiKey: 'AIzaSyDeSPCO40kAsHtIx6Ej6zulu2Bh2Ukd2PU',
  authDomain: 'pelu-harliz-green.firebaseapp.com',
  messagingSenderId: '217318402011'
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);
