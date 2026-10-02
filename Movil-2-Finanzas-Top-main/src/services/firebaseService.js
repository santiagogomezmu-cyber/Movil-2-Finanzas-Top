import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const readEnvValue = (key) => {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
};

const firebaseConfig = {
  apiKey: readEnvValue('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: readEnvValue('EXPO_PUBLIC_AUTH_DOMAIN'),
  projectId: readEnvValue('EXPO_PUBLIC_PROJECT_ID'),
  storageBucket: readEnvValue('EXPO_PUBLIC_STORAGE_BUCKET'),
  messagingSenderId: readEnvValue('EXPO_PUBLIC_MESSAGING_SENDER_ID'),
  appId: readEnvValue('EXPO_PUBLIC_APP_ID')
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
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
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