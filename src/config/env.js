const get = (key, fallback = '') => process.env[key] ?? fallback;

export const firebaseConfig = {
  apiKey: get('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: get('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: get('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: get('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: get('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: get('EXPO_PUBLIC_FIREBASE_APP_ID'),
};

export const isFirebaseConfigured = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
