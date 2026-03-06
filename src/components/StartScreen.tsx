"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { SPRITE_FRAME_W, SPRITE_FRAME_H, CHAR_COUNT } from '@/game/constants'

export default function StartScreen() {
  const { gamePhase, advanceToCharacterSelect, setSelectedCharacter, setUsername, startPlaying } = useGameStore()
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Title phase: press any key to advance
  useEffect(() => {
    if (gamePhase !== 'title') return
    function onKey() {
      advanceToCharacterSelect()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onKey)
    }
  }, [gamePhase, advanceToCharacterSelect])

  // Auto-focus input when entering name phase
  useEffect(() => {
    if (gamePhase === 'character-select') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [gamePhase])

  const handleStart = useCallback(async () => {
    const trimmed = name.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 16)
    if (!trimmed) return
    setSelectedCharacter(selected)
    setUsername(trimmed)
    startPlaying()

    // Notify Phaser that username is set
    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.USERNAME_SET)
  }, [name, selected, setSelectedCharacter, setUsername, startPlaying])

  if (gamePhase === 'playing') return null

  // ---------- TITLE PHASE ----------
  if (gamePhase === 'title') {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
        style={{
          backgroundImage: 'url(/start-screen.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative mb-10 text-3xl tracking-wide text-white pixel-font drop-shadow-lg">hanzfernando.dev</h1>
        <p className="relative animate-pulse text-sm text-gray-300">Press any key to start</p>
      </div>
    )
  }

  // ---------- CHARACTER SELECT + NAME ENTRY PHASE ----------
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
      style={{
        backgroundImage: 'url(/start-screen.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <h2 className="relative mb-6 text-xl text-white pixel-font">Choose your character</h2>

      <div className="relative mb-8 flex gap-6">
        {Array.from({ length: CHAR_COUNT }, (_, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex items-center justify-center rounded-lg border-2 p-8 transition-colors ${
              selected === i
                ? 'border-green-400 bg-green-900/40'
                : 'border-gray-600 bg-gray-800/40 hover:border-gray-400'
            }`}
          >
            <div
              style={{
                width: SPRITE_FRAME_W,
                height: SPRITE_FRAME_H,
                backgroundImage: `url(/pixel/char-${i + 1}-sprite.png)`,
                backgroundPosition: '0px 0px',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                transform: 'scale(3)',
              }}
            />
          </button>
        ))}
      </div>

      <input
        ref={inputRef}
        className="relative mb-4 w-64 rounded border pixel-font border-gray-600 bg-gray-900 px-3 py-2 text-center text-xs text-white outline-none focus:border-green-400"
        placeholder="Enter your name"
        maxLength={16}
        value={name}
        onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleStart()
        }}
        autoFocus
      />

      <button
        className="relative rounded bg-green-600 px-6 py-2 text-sm text-white transition-colors hover:bg-green-500 disabled:opacity-40"
        disabled={!name.trim()}
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  )
}
