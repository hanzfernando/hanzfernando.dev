'use client'

import { useGameStore } from '@/store/gameStore'
import { EventBus, GameEvents } from '@/game/EventBus'

export default function HUD() {
  const username = useGameStore((s) => s.username)

  const handleMoveStart = (direction: 'up' | 'down' | 'left' | 'right') => {
    EventBus.emit(GameEvents.MOBILE_MOVE, { direction, isDown: true })
  }

  const handleMoveEnd = (direction: 'up' | 'down' | 'left' | 'right') => {
    EventBus.emit(GameEvents.MOBILE_MOVE, { direction, isDown: false })
  }

  const handleInteract = () => {
    EventBus.emit(GameEvents.MOBILE_INTERACT)
  }

  return (
    <>
      {/* Top HUD badges */}
      <div className="absolute top-3 left-3 z-30 bg-black/50 px-2 py-1 text-xs text-white rounded-sm">
        {username || '...'}
      </div>
      <div className="absolute top-3 right-3 z-30 bg-black/50 px-2 py-1 text-xs text-white rounded-sm">
        🟢 Online
      </div>

      <div className="absolute inset-0 z-30 md:hidden pointer-events-none">
        <div className="absolute bottom-6 left-4 pointer-events-auto select-none">
          <div className="grid grid-cols-3 gap-2 text-xs text-white">
            <div />
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-black/40 border border-white/20 active:bg-white/20 flex items-center justify-center"
              onPointerDown={() => handleMoveStart('up')}
              onPointerUp={() => handleMoveEnd('up')}
              onPointerCancel={() => handleMoveEnd('up')}
              onPointerLeave={() => handleMoveEnd('up')}
            >
              ▲
            </button>
            <div />

            <button
              type="button"
              className="w-12 h-12 rounded-full bg-black/40 border border-white/20 active:bg-white/20 flex items-center justify-center"
              onPointerDown={() => handleMoveStart('left')}
              onPointerUp={() => handleMoveEnd('left')}
              onPointerCancel={() => handleMoveEnd('left')}
              onPointerLeave={() => handleMoveEnd('left')}
            >
              ◀
            </button>
            <div className="w-12 h-12" />
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-black/40 border border-white/20 active:bg-white/20 flex items-center justify-center"
              onPointerDown={() => handleMoveStart('right')}
              onPointerUp={() => handleMoveEnd('right')}
              onPointerCancel={() => handleMoveEnd('right')}
              onPointerLeave={() => handleMoveEnd('right')}
            >
              ▶
            </button>

            <div />
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-black/40 border border-white/20 active:bg-white/20 flex items-center justify-center"
              onPointerDown={() => handleMoveStart('down')}
              onPointerUp={() => handleMoveEnd('down')}
              onPointerCancel={() => handleMoveEnd('down')}
              onPointerLeave={() => handleMoveEnd('down')}
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        <div className="absolute bottom-8 right-6 pointer-events-auto">
          <button
            type="button"
            className="w-16 h-16 rounded-full bg-emerald-500/90 border border-white/40 shadow-lg text-xs font-semibold text-white active:bg-emerald-400/90"
            onClick={handleInteract}
          >
            Interact
          </button>
        </div>
      </div>
    </>
  )
}
