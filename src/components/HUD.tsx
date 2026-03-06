'use client'

import { useGameStore } from '@/store/gameStore'

export default function HUD() {
  const username = useGameStore((s) => s.username)

  return (
    <>
      <div className="fixed top-3 left-3 z-30 bg-black/50 px-2 py-1 text-xs text-white">
        {username || '...'}
      </div>
      <div className="fixed top-3 right-3 z-30 bg-black/50 px-2 py-1 text-xs text-white">
        🟢 Online
      </div>
    </>
  )
}
