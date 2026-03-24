import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from '../config/env';

let _db = null;

export const getFirebaseAuth = () => {
  if (!isFirebaseConfigured()) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
};

export const getFirestoreDb = () => {
  if (!isFirebaseConfigured()) return null;
  if (_db) return _db;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _db = getFirestore(app);
  return _db;
};
