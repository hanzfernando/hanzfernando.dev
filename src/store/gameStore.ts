import { create } from 'zustand'
import pokemon from '@/data/pokemon.json'

export type PanelType = 'about' | 'projects' | 'resume' | 'contact' | 'career' | 'grass' | null
export type GamePhase = 'title' | 'character-select' | 'playing'

export interface ChatMessage {
  username: string
  message: string
  timestamp: number
}

interface GameStore {
  activePanel: PanelType
  username: string
  isUsernameSet: boolean
  selectedCharacter: number
  gamePhase: GamePhase
  chatMessages: ChatMessage[]
  playerTileX: number | null
  playerTileY: number | null
  grassEncounterIndex: number
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  setUsername: (name: string) => void
  setSelectedCharacter: (index: number) => void
  advanceToCharacterSelect: () => void
  startPlaying: () => void
  addChatMessage: (msg: ChatMessage) => void
  setPlayerTile: (x: number, y: number) => void
  setGrassEncounterIndex: (index: number) => void
  resetToTitle: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  activePanel: null,
  username: '',
  isUsernameSet: false,
  selectedCharacter: 0,
  gamePhase: 'title',
  chatMessages: [],
  playerTileX: null,
  playerTileY: null,
  grassEncounterIndex: 0,
  openPanel: (panel) =>
    set(() => {
      if (panel !== 'grass' || pokemon.length === 0) {
        return { activePanel: panel }
      }

      const encounterIndex = Math.floor(Math.random() * pokemon.length)
      return { activePanel: panel, grassEncounterIndex: encounterIndex }
    }),
  closePanel: () => set({ activePanel: null }),
  setUsername: (name) => set({ username: name, isUsernameSet: true }),
  setSelectedCharacter: (index) => set({ selectedCharacter: index }),
  advanceToCharacterSelect: () => set({ gamePhase: 'character-select' }),
  startPlaying: () => set({ gamePhase: 'playing' }),
  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setPlayerTile: (x, y) => set({ playerTileX: x, playerTileY: y }),
  setGrassEncounterIndex: (index) => set({ grassEncounterIndex: index }),
  resetToTitle: () =>
    set({
      gamePhase: 'title',
      activePanel: null,
      username: '',
      isUsernameSet: false,
      selectedCharacter: 0,
      chatMessages: [],
      playerTileX: null,
      playerTileY: null,
      grassEncounterIndex: 0,
    }),
}))
