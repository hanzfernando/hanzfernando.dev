"use client"

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function StartScreen() {
  const { isUsernameSet, setUsername } = useGameStore()
  const [name, setName] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && name.trim()) {
        setUsername(name.trim())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [name, setUsername])

  if (isUsernameSet) return null

  return (
    <div className="start-screen fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-xl p-6 text-center text-white">
        <h1 className="mb-4 text-2xl">hanzfernando.dev</h1>
        <p className="mb-6 text-sm">Welcome — enter a display name and press Enter to start</p>
        <input
          className="username-input mb-4 w-3/4 rounded px-3 py-2 text-black"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) setUsername(name.trim())
          }}
        />
        <div>
          <button
            className="rounded bg-green-600 px-4 py-2 text-sm"
            onClick={() => name.trim() && setUsername(name.trim())}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}
