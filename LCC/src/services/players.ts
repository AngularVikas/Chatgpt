import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../utils/constants';

export const getPlayers = () =>
  getDocs(query(collection(db, COLLECTIONS.PLAYERS), orderBy('displayName')));

export const getPlayer = (id: string) => getDoc(doc(db, COLLECTIONS.PLAYERS, id));

export const addPlayer = (data: any) =>
  addDoc(collection(db, COLLECTIONS.PLAYERS), { ...data, matchesPlayed: 0, runs: 0, highScore: 0, battingAverage: 0, strikeRate: 0, wickets: 0, bowlingAverage: 0, economy: 0, catches: 0, createdAt: serverTimestamp() });

export const updatePlayer = (id: string, data: any) =>
  updateDoc(doc(db, COLLECTIONS.PLAYERS, id), { ...data, updatedAt: serverTimestamp() });

export const deletePlayer = (id: string) => deleteDoc(doc(db, COLLECTIONS.PLAYERS, id));

export const subscribePlayers = (callback: (players: any[]) => void) =>
  onSnapshot(query(collection(db, COLLECTIONS.PLAYERS), orderBy('displayName')), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
