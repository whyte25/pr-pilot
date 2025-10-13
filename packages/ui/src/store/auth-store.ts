import { create } from 'zustand'

interface AuthStore {
  showToken: boolean
  setShowToken: (show: boolean) => void
  toggleShowToken: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  showToken: false,
  setShowToken: (show) => set({ showToken: show }),
  toggleShowToken: () => set((state) => ({ showToken: !state.showToken })),
}))
