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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="border-4 border-gray-800 bg-white p-6 shadow-lg max-w-sm w-full mx-4"
        style={{ fontFamily: 'var(--font-pixel), monospace' }}
      >
        <h2 className="text-sm mb-4 text-gray-900 text-center">What is your name?</h2>
        <input
          type="text"
          className="w-full border-2 border-gray-600 bg-gray-100 px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
          maxLength={16}
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Enter your name"
          autoFocus
        />
        <button
          className="mt-4 w-full bg-gray-900 py-2 text-xs text-white hover:bg-gray-700 disabled:opacity-50"
          disabled={!input.trim()}
          onClick={handleSubmit}
        >
          START
        </button>
      </div>
    </div>
  )
}
