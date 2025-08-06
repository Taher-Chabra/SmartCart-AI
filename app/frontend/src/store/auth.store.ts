import { create } from 'zustand';
import { ICombinedUser } from '@smartcartai/shared/src/interface/user';

type AuthState = {
  user: ICombinedUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setUser: (user: ICombinedUser) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, loading: false, error: null })
}));