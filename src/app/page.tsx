'use client'

import dynamic from 'next/dynamic'
import { useGameStore } from '@/store/gameStore'
import ChatPanel from '@/components/ChatPanel'
import HUD from '@/components/HUD'
import StartScreen from '@/components/StartScreen'
import AboutPanel from '@/components/panels/AboutPanel'
import ProjectsPanel from '@/components/panels/ProjectsPanel'
import ContactPanel from '@/components/panels/ContactPanel'
import CareerPanel from '@/components/panels/CareerPanel'

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center bg-black"
    >
      <p className="text-xs text-white">Loading...</p>
    </div>
  ),
})

export default function Home() {
  const { activePanel, closePanel, gamePhase } = useGameStore()

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* 4:3 game viewport — all overlays are positioned relative to this */}
      <div
        className="relative"
        style={{
          width: 'min(100vw, calc(100vh * 4 / 3))',
          height: 'min(100vh, calc(100vw * 3 / 4))',
        }}
      >
        {gamePhase === 'playing' && (
          <>
            <PhaserGame />
            <HUD />
            <ChatPanel />

            {activePanel === 'about' && <AboutPanel onClose={closePanel} />}
            {activePanel === 'projects' && <ProjectsPanel onClose={closePanel} />}
            {activePanel === 'contact' && <ContactPanel onClose={closePanel} />}
            {activePanel === 'career' && <CareerPanel onClose={closePanel} />}
          </>
        )}
        <StartScreen />
      </div>
    </div>
  )
}
