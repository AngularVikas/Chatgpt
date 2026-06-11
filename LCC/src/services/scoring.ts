import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const updateLiveScore = (matchId: string, data: any) =>
  setDoc(doc(db, COLLECTIONS.LIVE_SCORES, matchId), { ...data, updatedAt: serverTimestamp() }, { merge: true });

export const subscribeLiveScore = (matchId: string, callback: (score: any) => void) =>
  onSnapshot(doc(db, COLLECTIONS.LIVE_SCORES, matchId), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
