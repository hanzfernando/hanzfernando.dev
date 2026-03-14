'use client'

import { useState, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function UsernameModal() {
  const { isUsernameSet, setUsername } = useGameStore()
  const [input, setInput] = useState('')

  const handleSubmit = useCallback(async () => {
    const trimmed = input.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 16)
    if (!trimmed) return
    setUsername(trimmed)

    // Emit to Phaser via EventBus (dynamic import to keep Phaser out of SSR)
    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.USERNAME_SET)
  }, [input, setUsername])

  if (isUsernameSet) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071122]/70 px-4">
      <div className="retro-panel float-fade-in pixel-font w-full max-w-sm p-6">
        <h2 className="pixel-font mb-4 text-center text-[11px] uppercase text-[#1e3553]">What Is Your Name?</h2>
        <input
          type="text"
          className="retro-input pixel-font w-full px-3 py-2 text-center text-[10px]"
          maxLength={16}
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Enter your name"
          autoFocus
        />
        <button
          className="retro-btn retro-btn-accent pixel-font mt-4 w-full py-2 text-[10px] uppercase disabled:opacity-50"
          disabled={!input.trim()}
          onClick={handleSubmit}
        >
          START
        </button>
      </div>
    </div>
  )
}
