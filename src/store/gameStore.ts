import { create } from 'zustand'

export type PanelType = 'about' | 'projects' | 'contact' | 'career' | null
export type GamePhase = 'title' | 'character-select' | 'playing'

interface GameStore {
  activePanel: PanelType
  username: string
  isUsernameSet: boolean
  selectedCharacter: number
  gamePhase: GamePhase
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  setUsername: (name: string) => void
  setSelectedCharacter: (index: number) => void
  advanceToCharacterSelect: () => void
  startPlaying: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  activePanel: null,
  username: '',
  isUsernameSet: false,
  selectedCharacter: 0,
  gamePhase: 'title',
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),
  setUsername: (name) => set({ username: name, isUsernameSet: true }),
  setSelectedCharacter: (index) => set({ selectedCharacter: index }),
  advanceToCharacterSelect: () => set({ gamePhase: 'character-select' }),
  startPlaying: () => set({ gamePhase: 'playing' }),
}))
