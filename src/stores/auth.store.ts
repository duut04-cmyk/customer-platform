import { create } from "zustand";
import type { PublicUser } from "@/api/auth";

export type AuthStoreState = {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  authError: string | null;
  setUser: (user: PublicUser | null) => void;
  clearUser: () => void;
  setInitializing: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  reset: () => void;
};

const loggedOutState = {
  user: null,
  isAuthenticated: false,
  isInitializing: false,
  isLoading: false,
  authError: null,
} as const;

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...loggedOutState,
  /** True until AuthProvider finishes the first initializeAuth() call. */
  isInitializing: true,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
      authError: null,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
  setInitializing: (value) => set({ isInitializing: value }),
  setLoading: (value) => set({ isLoading: value }),
  setError: (message) => set({ authError: message }),
  reset: () => set({ ...loggedOutState }),
}));
