import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { firebaseConfig, isFirebaseConfigured } from '../config/env';

let _db = null;
let _functions = null;

export const getFirebaseApp = () => {
  if (!isFirebaseConfigured()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
};

export const getFirestoreDb = () => {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_db) return _db;
  _db = getFirestore(app);
  return _db;
};

export const getFirebaseFunctions = () => {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_functions) return _functions;
  _functions = getFunctions(app, process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'asia-southeast1');
  return _functions;
};
