import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, onSnapshot, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const getUpcomingMatches = () =>
  getDocs(query(
    collection(db, COLLECTIONS.SCHEDULES),
    where('matchDate', '>=', Timestamp.now()),
    orderBy('matchDate', 'asc')
  ));

export const addMatch = (data: any, createdBy: string) =>
  addDoc(collection(db, COLLECTIONS.SCHEDULES), {
    ...data, createdBy, status: 'scheduled', createdAt: serverTimestamp(),
  });

export const updateMatch = (id: string, data: any) =>
  updateDoc(doc(db, COLLECTIONS.SCHEDULES, id), data);

export const deleteMatch = (id: string) => deleteDoc(doc(db, COLLECTIONS.SCHEDULES, id));

export const subscribeSchedule = (callback: (matches: any[]) => void) =>
  onSnapshot(query(collection(db, COLLECTIONS.SCHEDULES), orderBy('matchDate', 'asc')), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
