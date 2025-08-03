import { create } from 'zustand';
import { ICombinedUser } from '@smartcartai/shared/src/interface/user';

type AuthState = {
   user: ICombinedUser | null;
   isAuthenticated: boolean;
   loading: boolean;
   setUser: (user: ICombinedUser) => void;
   clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
   user: null,
   isAuthenticated: false,
   loading: false,

   setUser: (user: ICombinedUser) => set({ user, isAuthenticated: true, loading: false }),
   clearUser: () => set({ user: null, isAuthenticated: false, loading: false }),

}));