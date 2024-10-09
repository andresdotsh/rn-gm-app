import { create } from 'zustand'

export const useCurrentUserStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (newValue) => set({ isLoggedIn: Boolean(newValue) }),
}))
