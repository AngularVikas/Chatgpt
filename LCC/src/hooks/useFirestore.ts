import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useCollection(collectionName: string, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(q,
      snap => { setData(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      err => { setError(err); setLoading(false); }
    );
    return unsub;
  }, [collectionName]);

  return { data, loading, error };
}
