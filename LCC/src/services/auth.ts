import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = async (email: string, password: string, displayName: string, role: string = 'member') => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
    uid: user.uid, email, displayName, role,
    membershipStatus: 'none', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return user;
};

export const signOut = () => firebaseSignOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? snap.data() : null;
};

export const subscribeToAuthState = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
