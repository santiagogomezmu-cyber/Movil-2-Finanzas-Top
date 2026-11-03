import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim() || '',
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN?.trim() || '',
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID?.trim() || '',
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET?.trim() || '',
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID?.trim() || '',
  appId: process.env.EXPO_PUBLIC_APP_ID?.trim() || ''
};

const requiredFirebaseFields = Object.entries(firebaseConfig).filter(([key, value]) => {
  if (!value) return true;
  return value.includes('YOUR_') || value.includes('your_') || value.includes('example');
});

const isFirebaseConfigured = requiredFirebaseFields.length === 0;

if (!isFirebaseConfigured) {
  const missingFields = Object.entries(firebaseConfig)
    .filter(([, value]) => !value || value.includes('YOUR_') || value.includes('your_') || value.includes('example'))
    .map(([key]) => key);

  console.warn(
    'Firebase no está configurado. Define las variables EXPO_PUBLIC_* en un archivo .env o crea tu .env.example con los valores correctos. Campos faltantes:',
    missingFields
  );
}

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
    } catch (error) {
      if (error.code !== 'auth/already-initialized') throw error;
      auth = getAuth(app);
    }
    db = getFirestore(app);
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
    app = null;
    auth = null;
    db = null;
  }
}

export const ensureFirebaseAuth = () => {
  if (!auth) {
    throw new Error('Firebase no está configurado o la API key es inválida. Revisa tu archivo .env y la configuración del proyecto en Firebase Console.');
  }

  return auth;
};

export {
  app,
  db,
  auth,
  isFirebaseConfigured,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};