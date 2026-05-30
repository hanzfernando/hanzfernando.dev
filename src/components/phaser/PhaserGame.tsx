'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    let destroyed = false
    let cleanupEvents = () => {}

    async function init() {
      const Phaser = (await import('phaser')).default
      const { BootScene } = await import('@/game/scenes/BootScene')
      const { GameScene } = await import('@/game/scenes/GameScene')
      const { UIScene } = await import('@/game/scenes/UIScene')
      const { EventBus, GameEvents } = await import('@/game/EventBus')

      if (destroyed || !containerRef.current) return

      const container = containerRef.current
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: container.clientWidth,
        height: container.clientHeight,
        pixelArt: true,
        antialias: false,
        roundPixels: true,
        parent: container,
        backgroundColor: '#000000',
        physics: { default: 'arcade', arcade: { debug: false } },
        scene: [BootScene, GameScene, UIScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      })

      gameRef.current = game

      // Bridge Phaser interactions to React UI
      const handleInteraction = (...args: unknown[]) => {
        const data = args[0] as { type: string }
        const store = useGameStore.getState()
        if (data.type === 'about' || data.type === 'projects' || data.type === 'contact' || data.type === 'career') {
          store.openPanel(data.type)
        }
      }

      const handleGrassEncounter = (...args: unknown[]) => {
        const data = args[0] as { encounterIndex?: number } | undefined
        const store = useGameStore.getState()
        store.setGrassEncounterIndex(data?.encounterIndex ?? 0)
        EventBus.emit(GameEvents.PLAYER_INPUT_ENABLED, false)
        store.openPanel('grass')
      }

      EventBus.on(GameEvents.INTERACTION, handleInteraction)
      EventBus.on(GameEvents.GRASS_ENCOUNTER, handleGrassEncounter)
      cleanupEvents = () => {
        EventBus.off(GameEvents.INTERACTION, handleInteraction)
        EventBus.off(GameEvents.GRASS_ENCOUNTER, handleGrassEncounter)
      }
    }

    init()

    return () => {
      destroyed = true
      cleanupEvents()
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-black"
      style={{ touchAction: 'none' }}
    />
  )

}
