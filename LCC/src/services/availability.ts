import {
  collection, doc, setDoc, getDocs, query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const setAvailability = (matchId: string, playerId: string, playerName: string, status: string, note?: string) =>
  setDoc(doc(db, COLLECTIONS.AVAILABILITY, `${matchId}_${playerId}`), {
    matchId, playerId, playerName, status, note: note || '', updatedAt: serverTimestamp(),
  });

export const getMatchAvailability = (matchId: string) =>
  getDocs(query(collection(db, COLLECTIONS.AVAILABILITY), where('matchId', '==', matchId)));

export const subscribeMatchAvailability = (matchId: string, callback: (items: any[]) => void) =>
  onSnapshot(query(collection(db, COLLECTIONS.AVAILABILITY), where('matchId', '==', matchId)), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
