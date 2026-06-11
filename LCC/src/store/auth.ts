import { create } from 'zustand';
import { User } from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'player' | 'member';
  membershipStatus: 'none' | 'basic' | 'player' | 'premium';
  photoURL?: string;
  jerseyNumber?: number;
}

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, profile: null, loading: true, isAdmin: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, isAdmin: profile?.role === 'admin' }),
  setLoading: (loading) => set({ loading }),
}));
