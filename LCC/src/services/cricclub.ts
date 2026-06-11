import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_CRICCLUB_API_BASE || 'https://ccapi.cricclubs.com/CCAPI';
const API_KEY = process.env.EXPO_PUBLIC_CRICCLUB_API_KEY;
const CLUB_ID = process.env.EXPO_PUBLIC_CRICCLUB_CLUB_ID;
const CACHE_TTL = 5 * 60 * 1000;

const isStubMode = !API_KEY;

const STUB_SCORECARD = {
  matchTitle: 'LCC vs Thunder CC',
  date: '2024-06-15',
  venue: 'Louisville Cricket Ground',
  result: 'LCC won by 24 runs',
  innings: [{
    team: 'LCC', total: 165, wickets: 6, overs: 20,
    batting: [
      { name: 'Vikas S.', runs: 52, balls: 38, fours: 6, sixes: 2, sr: 136.8, dismissal: 'c Thomson b Smith' },
      { name: 'Raj P.', runs: 34, balls: 28, fours: 4, sixes: 0, sr: 121.4, dismissal: 'b Jones' },
      { name: 'Amir K.', runs: 28, balls: 22, fours: 2, sixes: 1, sr: 127.3, dismissal: 'not out' },
    ],
    bowling: [
      { name: 'T. Smith', overs: 4, maidens: 0, runs: 38, wickets: 2, economy: 9.5 },
      { name: 'R. Jones', overs: 4, maidens: 1, runs: 24, wickets: 2, economy: 6.0 },
    ],
  }],
};

const STUB_STANDINGS = [
  { position: 1, team: 'LCC', played: 8, won: 6, lost: 1, draw: 1, points: 13, nrr: '+1.245' },
  { position: 2, team: 'Thunder CC', played: 8, won: 5, lost: 2, draw: 1, points: 11, nrr: '+0.812' },
  { position: 3, team: 'Royals CC', played: 8, won: 4, lost: 3, draw: 1, points: 9, nrr: '+0.341' },
  { position: 4, team: 'Metro CC', played: 8, won: 3, lost: 4, draw: 1, points: 7, nrr: '-0.156' },
  { position: 5, team: 'Warriors CC', played: 8, won: 1, lost: 6, draw: 1, points: 3, nrr: '-1.890' },
];

async function cachedFetch(key: string, fetcher: () => Promise<any>) {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
    const data = await fetcher();
    await AsyncStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
    return data;
  } catch {
    const cached = await AsyncStorage.getItem(key);
    if (cached) return JSON.parse(cached).data;
    throw new Error('Network error and no cached data');
  }
}

export const getScorecard = (matchId?: string) => {
  if (isStubMode) return Promise.resolve(STUB_SCORECARD);
  return cachedFetch(`scorecard_${matchId}`, async () => {
    const res = await fetch(`${API_BASE}/getScorecard?apiKey=${API_KEY}&clubId=${CLUB_ID}&matchId=${matchId}`);
    return res.json();
  });
};

export const getStandings = () => {
  if (isStubMode) return Promise.resolve(STUB_STANDINGS);
  return cachedFetch('standings', async () => {
    const res = await fetch(`${API_BASE}/getStandings?apiKey=${API_KEY}&clubId=${CLUB_ID}`);
    return res.json();
  });
};
