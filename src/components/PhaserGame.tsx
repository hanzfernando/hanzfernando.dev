'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    let destroyed = false

    async function init() {
      const Phaser = (await import('phaser')).default
      const { BootScene } = await import('@/game/scenes/BootScene')
      const { GameScene } = await import('@/game/scenes/GameScene')
      const { UIScene } = await import('@/game/scenes/UIScene')
      const { EventBus, GameEvents } = await import('@/game/EventBus')

      if (destroyed || !containerRef.current) return

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        pixelArt: true,
        antialias: false,
        roundPixels: true,
        parent: containerRef.current,
        backgroundColor: '#1a472a',
        physics: { default: 'arcade', arcade: { debug: false } },
        scene: [BootScene, GameScene, UIScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      })

      gameRef.current = game

      // Bridge Phaser interactions to React UI
      EventBus.on(GameEvents.INTERACTION, (...args: unknown[]) => {
        const data = args[0] as { type: string }
        const store = useGameStore.getState()
        if (data.type === 'about' || data.type === 'projects' || data.type === 'contact' || data.type === 'career') {
          store.openPanel(data.type)
        }
      })
    }

    init()

    return () => {
      destroyed = true
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
