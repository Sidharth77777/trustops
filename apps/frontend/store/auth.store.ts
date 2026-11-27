import { AuthStore } from "@/types/types";
import { create } from "zustand";

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  isAuthInitialized: false,

  setAuthInitialized: (value) =>
    set({ isAuthInitialized: value }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: true,
    }),

  setUser: (user) => set({ user }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}))