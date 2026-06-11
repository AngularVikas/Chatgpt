import {
  collection, doc, addDoc, updateDoc, getDocs, query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const getUserMembership = (userId: string) =>
  getDocs(query(collection(db, COLLECTIONS.MEMBERSHIPS), where('userId', '==', userId)));

export const createMembership = (userId: string, tier: string) => {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return addDoc(collection(db, COLLECTIONS.MEMBERSHIPS), {
    userId, tier, status: 'active', startDate: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiry), autoRenew: false, createdAt: serverTimestamp(),
  });
};

export const cancelMembership = (id: string) =>
  updateDoc(doc(db, COLLECTIONS.MEMBERSHIPS, id), { status: 'cancelled' });
