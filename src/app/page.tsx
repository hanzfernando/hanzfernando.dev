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
    <div className="w-full max-w-7xl mx-auto h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
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
