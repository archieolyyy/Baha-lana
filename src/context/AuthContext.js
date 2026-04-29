import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseAuth, getFirestoreDb, getFirebaseFunctions } from '../services/firebaseApp';
import { isFirebaseConfigured } from '../config/env';
import { normalizePhilippinesPhone, isValidPhilippinesMobile } from '../utils/phone';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const firebaseReady = isFirebaseConfigured();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(() => firebaseReady);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = useCallback(async (uid) => {
    const db = getFirestoreDb();
    if (!db || !uid) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setProfile(snap.data());
      else setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadProfile(u.uid);
      else setProfile(null);
      setLoading(false);
    });
    return unsub;
  }, [firebaseReady, loadProfile]);

  const signUp = useCallback(
    async (email, password, displayName, phoneRaw) => {
      const phoneE164 = normalizePhilippinesPhone(phoneRaw);
      if (!phoneE164 || !isValidPhilippinesMobile(phoneE164)) {
        throw new Error('Enter a valid PH mobile (e.g. 09XX XXX XXXX)');
      }
      if (!firebaseReady) {
        throw new Error('Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* values in .env.');
      }
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      if (!auth || !db) throw new Error('Firebase not configured');
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: displayName.trim() });
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName: displayName.trim(),
        phoneE164,
        location: 'Zamboanga City',
        phoneVerified: false,
        smsAlertsEnabled: false,
        updatedAt: serverTimestamp(),
      });
      setProfile({
        displayName: displayName.trim(),
        phoneE164,
        location: 'Zamboanga City',
        phoneVerified: false,
        smsAlertsEnabled: false,
      });
    },
    [firebaseReady],
  );

  const signIn = useCallback(async (email, password) => {
    if (!firebaseReady) {
      throw new Error('Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* values in .env.');
    }
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not configured');
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, [firebaseReady]);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
    setProfile(null);
  }, []);

  const updateUserProfile = useCallback(
    async ({ displayName, phoneRaw, location }) => {
      if (!firebaseReady) {
        throw new Error('Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* values in .env.');
      }
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      if (!user || !auth || !db) throw new Error('Not signed in');
      const phoneE164 = normalizePhilippinesPhone(phoneRaw);
      if (!phoneE164 || !isValidPhilippinesMobile(phoneE164)) {
        throw new Error('Enter a valid PH mobile (e.g. 09XX XXX XXXX)');
      }
      const name = displayName.trim();
      const nextLocation = location || 'Zamboanga City';
      const didPhoneChange = phoneE164 !== profile?.phoneE164;
      await updateProfile(user, { displayName: name });
      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName: name,
          phoneE164,
          location: nextLocation,
          phoneVerified: didPhoneChange ? false : !!profile?.phoneVerified,
          smsAlertsEnabled:
            didPhoneChange || !profile?.phoneVerified ? false : !!profile?.smsAlertsEnabled,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setProfile((p) => ({
        ...p,
        displayName: name,
        phoneE164,
        location: nextLocation,
        phoneVerified: didPhoneChange ? false : !!p?.phoneVerified,
        smsAlertsEnabled:
          didPhoneChange || !p?.phoneVerified ? false : !!p?.smsAlertsEnabled,
      }));
    },
    [firebaseReady, user, profile],
  );

  const sendPhoneVerificationOtp = useCallback(
    async (phoneRaw) => {
      if (!firebaseReady) {
        throw new Error('Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* values in .env.');
      }
      const auth = getFirebaseAuth();
      const fns = getFirebaseFunctions();
      const phoneE164 = normalizePhilippinesPhone(phoneRaw);
      if (!auth || !auth.currentUser) throw new Error('Not signed in');
      if (!phoneE164 || !isValidPhilippinesMobile(phoneE164)) {
        throw new Error('Enter a valid PH mobile (e.g. 09XX XXX XXXX)');
      }
      if (!fns) throw new Error('Firebase Functions not available.');
      const call = httpsCallable(fns, 'sendPhoneVerificationOtp');
      await call({ phoneE164 });
      return phoneE164;
    },
    [firebaseReady],
  );

  const verifyPhoneOtp = useCallback(
    async ({ phoneRaw, otpCode }) => {
      if (!firebaseReady) {
        throw new Error('Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* values in .env.');
      }
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      const fns = getFirebaseFunctions();
      const phoneE164 = normalizePhilippinesPhone(phoneRaw);
      if (!auth || !auth.currentUser || !db) throw new Error('Not signed in');
      if (!phoneE164 || !isValidPhilippinesMobile(phoneE164)) {
        throw new Error('Enter a valid PH mobile (e.g. 09XX XXX XXXX)');
      }
      const cleanOtp = String(otpCode || '').trim();
      if (!/^\d{6}$/.test(cleanOtp)) {
        throw new Error('Enter a valid 6-digit OTP code.');
      }
      if (!fns) throw new Error('Firebase Functions not available.');
      const call = httpsCallable(fns, 'verifyPhoneVerificationOtp');
      await call({ phoneE164, otpCode: cleanOtp });
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          phoneE164,
          phoneVerified: true,
          phoneVerifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setProfile((p) => ({
        ...p,
        phoneE164,
        phoneVerified: true,
      }));
    },
    [firebaseReady],
  );

  const setSmsAlertsEnabled = useCallback(
    async (enabled) => {
      if (!firebaseReady) {
        throw new Error('Firebase not configured. Add EXPO_PUBLIC_FIREBASE_* values in .env.');
      }
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      if (!auth || !auth.currentUser || !db) throw new Error('Not signed in');
      if (!profile?.phoneVerified && enabled) {
        throw new Error('Verify your mobile number first.');
      }
      const next = !!enabled;
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          smsAlertsEnabled: next,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setProfile((p) => ({
        ...p,
        smsAlertsEnabled: next,
      }));
    },
    [firebaseReady, profile],
  );

  const displayName = useMemo(() => {
    if (profile?.displayName) return profile.displayName;
    if (user?.displayName) return user.displayName;
    return '';
  }, [profile, user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      firebaseReady,
      displayName,
      signUp,
      signIn,
      signOut,
      updateUserProfile,
      sendPhoneVerificationOtp,
      verifyPhoneOtp,
      setSmsAlertsEnabled,
      refreshProfile: () => (user ? loadProfile(user.uid) : Promise.resolve()),
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      displayName,
      signUp,
      signIn,
      signOut,
      updateUserProfile,
      sendPhoneVerificationOtp,
      verifyPhoneOtp,
      setSmsAlertsEnabled,
      firebaseReady,
      loadProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
