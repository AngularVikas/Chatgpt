import { create } from 'zustand';

interface AppStore {
  matches: any[];
  teams: any[];
  isOffline: boolean;
  setMatches: (matches: any[]) => void;
  setTeams: (teams: any[]) => void;
  setOffline: (isOffline: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  matches: [], teams: [], isOffline: false,
  setMatches: (matches) => set({ matches }),
  setTeams: (teams) => set({ teams }),
  setOffline: (isOffline) => set({ isOffline }),
}));
