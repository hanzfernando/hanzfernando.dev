  "use client"

  import { useEffect, useState, useCallback, useRef } from 'react'
  import { useGameStore } from '@/store/gameStore'
  import { SPRITE_FRAME_W, SPRITE_FRAME_H, CHAR_COUNT } from '@/game/constants'
  import { ArrowLeft, Dice5 } from 'lucide-react'
  import Link from 'next/link'

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
              <Dice5 className={`w-5 h-5 transition-transform ${rolling ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            className="w-full pixel-font max-w-xs rounded bg-green-600 px-6 py-3 text-xs text-white transition-colors hover:bg-green-500 active:bg-green-700 disabled:opacity-40"
            style={{ touchAction: 'manipulation', minHeight: '48px' }}
            disabled={!name.trim()}
            onClick={handleStart}
          >
            Start
          </button>
        </div>

        <Link
          href='/'
          className='fixed bottom-6 right-6 flex items-center gap-2 border border-white/20 bg-[var(--card)] px-3 py-2 text-xs font-mono hover:bg-white/10 transition-colors'
        >
          <ArrowLeft size={13} />
          Back
        </Link>
      </div>
    )
  }