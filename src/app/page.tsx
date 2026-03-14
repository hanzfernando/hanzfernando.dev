'use client'

import dynamic from 'next/dynamic'
import { useGameStore } from '@/store/gameStore'
import ChatPanel from '@/components/ChatPanel'
import HUD from '@/components/HUD'
import StartScreen from '@/components/StartScreen'
import MusicPlayer from '@/components/MusicPlayer'
import AboutPanel from '@/components/panels/AboutPanel'
import ProjectsPanel from '@/components/panels/ProjectsPanel'
import ContactPanel from '@/components/panels/ContactPanel'
import CareerPanel from '@/components/panels/CareerPanel'
import ResumePanel from '@/components/panels/ResumePanel'

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="retro-pixel-surface flex h-full w-full items-center justify-center">
      <p className="pixel-font text-[10px] uppercase text-[#1d3553]">Loading...</p>
    </div>
  ),
})

export default function Home() {
  const { activePanel, closePanel, gamePhase } = useGameStore()
  return (
    <div className="relative mx-auto h-screen w-full max-w-[1440px] overflow-hidden border-x-4 border-[#111827] bg-[#0f2540] shadow-[0_0_0_4px_#213f66]">
      <div className="absolute inset-0">
        {gamePhase === 'playing' && (
          <>
            <PhaserGame />
            <MusicPlayer />
            <HUD />
            <ChatPanel />
            {activePanel === 'about' && <AboutPanel onClose={closePanel} />}
            {activePanel === 'projects' && <ProjectsPanel onClose={closePanel} />}
            {activePanel === 'resume' && <ResumePanel onClose={closePanel} />}
            {activePanel === 'contact' && <ContactPanel onClose={closePanel} />}
            {activePanel === 'career' && <CareerPanel onClose={closePanel} />}
          </>
        )}
        <StartScreen />
      </div>
    </div>
  )
}
