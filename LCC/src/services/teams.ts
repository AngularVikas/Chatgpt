import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const getTeams = () => getDocs(query(collection(db, COLLECTIONS.TEAMS), orderBy('name')));

export const addTeam = (data: any) =>
  addDoc(collection(db, COLLECTIONS.TEAMS), { ...data, matchesPlayed: 0, wins: 0, losses: 0, draws: 0, createdAt: serverTimestamp() });

export const updateTeam = (id: string, data: any) =>
  updateDoc(doc(db, COLLECTIONS.TEAMS, id), data);

export const deleteTeam = (id: string) => deleteDoc(doc(db, COLLECTIONS.TEAMS, id));

export const subscribeTeams = (callback: (teams: any[]) => void) =>
  onSnapshot(query(collection(db, COLLECTIONS.TEAMS), orderBy('name')), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
