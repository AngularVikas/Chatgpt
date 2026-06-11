import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY || 'demo-key',
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID || 'lcc-demo',
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET || 'lcc-demo.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_SENDER_ID || '123456',
  appId: process.env.EXPO_PUBLIC_FB_APP_ID || '1:123:web:abc',
};

const app = getApps().length ? getApp() : initializeApp(config);

let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
