import { create } from 'zustand'

export type PanelType = 'about' | 'projects' | 'contact' | 'career' | null

interface GameStore {
  activePanel: PanelType
  username: string
  isUsernameSet: boolean
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  setUsername: (name: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  activePanel: null,
  username: '',
  isUsernameSet: false,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),
  setUsername: (name) => set({ username: name, isUsernameSet: true }),
}))
