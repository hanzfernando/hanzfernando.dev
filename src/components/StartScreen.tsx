"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { SPRITE_FRAME_W, SPRITE_FRAME_H, CHAR_COUNT } from '@/game/constants'

async function fetchRandomName(): Promise<string> {
  const res = await fetch('https://randomuser.me/api/?inc=name&noinfo')
  const data = await res.json()
  const { first, last } = data.results[0].name
  // Combine first + last initial, e.g. "Luna K" — fits 16 char limit nicely
  const combined = `${first} ${last[0]}`
  return combined.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 16)
}

export default function StartScreen() {
  const { gamePhase, advanceToCharacterSelect, setSelectedCharacter, setUsername, startPlaying } = useGameStore()
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState('')
  const [rolling, setRolling] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Title phase: press any key or tap to advance
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

  // Auto-focus input when entering name phase (skip on mobile to avoid keyboard jump)
  useEffect(() => {
    if (gamePhase === 'character-select') {
      const isMobile = window.matchMedia('(max-width: 640px)').matches
      if (!isMobile) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }, [gamePhase])

  const handleRandomName = useCallback(async () => {
    if (rolling) return
    setRolling(true)
    try {
      const randomName = await fetchRandomName()
      setName(randomName)
    } catch {
      // Fallback list if the API fails
      const fallbacks = ['Shadow X', 'Pixel K', 'Blaze M', 'Nova J', 'Glitch R', 'Storm A']
      setName(fallbacks[Math.floor(Math.random() * fallbacks.length)])
    } finally {
      setRolling(false)
    }
  }, [rolling])

  const handleStart = useCallback(async () => {
    const trimmed = name.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 16)
    if (!trimmed) return
    setSelectedCharacter(selected)
    setUsername(trimmed)
    startPlaying()

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
        <h1 className="relative mb-10 text-2xl sm:text-3xl tracking-wide text-white pixel-font drop-shadow-lg px-4 text-center">
          hanzfernando.dev
        </h1>
        <p className="relative animate-pulse text-sm text-gray-300">
          <span className="hidden sm:inline">Press any key to start</span>
          <span className="inline sm:hidden">Tap anywhere to start</span>
        </p>
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

      <div className="relative flex flex-col items-center w-full max-h-screen overflow-y-auto px-4 py-8">
        <h2 className="mb-5 text-lg sm:text-xl text-white pixel-font">Choose your character</h2>

        <div className="mb-6 flex flex-wrap justify-center gap-3 sm:gap-6">
          {Array.from({ length: CHAR_COUNT }, (_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex items-center justify-center rounded-lg border-2 transition-colors p-5 sm:p-8 ${
                selected === i
                  ? 'border-green-400 bg-green-900/40'
                  : 'border-gray-600 bg-gray-800/40 active:border-gray-400 hover:border-gray-400'
              }`}
              style={{ touchAction: 'manipulation' }}
              aria-label={`Character ${i + 1}`}
              aria-pressed={selected === i}
            >
              <div
                style={{
                  width: SPRITE_FRAME_W,
                  height: SPRITE_FRAME_H,
                  backgroundImage: `url(/pixel/characters/char-${i + 1}-sprite.png)`,
                  backgroundPosition: '0px 0px',
                  backgroundRepeat: 'no-repeat',
                  imageRendering: 'pixelated',
                  transform: 'scale(2.5)',
                }}
              />
            </button>
          ))}
        </div>

        {/* Name input row with dice button */}
        <div className="mb-4 flex w-full max-w-xs items-center gap-2">
          <input
            ref={inputRef}
            className="flex-1 min-w-0 rounded border pixel-font border-gray-600 bg-gray-900 px-3 py-3 text-center text-white outline-none focus:border-green-400 transition-colors"
            placeholder="Enter your name"
            maxLength={16}
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                inputRef.current?.blur()
                handleStart()
              }
            }}
            style={{ fontSize: '16px' }}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
          />

          {/* Dice / randomize button */}
          <button
            onClick={handleRandomName}
            disabled={rolling}
            aria-label="Randomize name"
            title="Random name"
            style={{ touchAction: 'manipulation', minWidth: '48px', minHeight: '48px' }}
            className="flex items-center justify-center rounded border-2 border-gray-600 bg-gray-800/60 text-gray-300 transition-colors hover:border-green-400 hover:text-green-400 active:bg-gray-700 disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-5 h-5 transition-transform ${rolling ? 'animate-spin' : ''}`}
            >
              <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5zm2.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.5 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.5 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
            </svg>
          </button>
        </div>

        <button
          className="w-full max-w-xs rounded bg-green-600 px-6 py-3 text-sm text-white transition-colors hover:bg-green-500 active:bg-green-700 disabled:opacity-40"
          style={{ touchAction: 'manipulation', minHeight: '48px' }}
          disabled={!name.trim()}
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </div>
  )
}