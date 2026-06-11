import { create } from 'zustand';

interface PlayersStore {
  players: any[];
  loading: boolean;
  setPlayers: (players: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const usePlayersStore = create<PlayersStore>((set) => ({
  players: [], loading: false,
  setPlayers: (players) => set({ players }),
  setLoading: (loading) => set({ loading }),
}));
