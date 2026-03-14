'use client'

import PanelBase from '@/components/panels/PanelBase'
import { EventBus, GameEvents } from '@/game/EventBus'
import { useGameStore } from '@/store/gameStore'

interface AboutPanelProps {
  onClose: () => void
}

export default function AboutPanel({ onClose }: AboutPanelProps) {
  const openPanel = useGameStore((s) => s.openPanel)

  function handleProjectsClick() {
    EventBus.emit(GameEvents.TELEPORT_TO, { tileX: 27, tileY: 10 });
      (async () => {
        await new Promise((res) => setTimeout(res, 1400))
        openPanel('projects')
      })()
  }

  return (
    <PanelBase title="About Me" onClose={onClose}>
      <div className="space-y-4 text-[12px] leading-relaxed md:text-[13px]">
        <div className="retro-card p-3">
          <h3 className="pixel-font text-[11px] uppercase tracking-wide text-[#20334a] md:text-[12px]">Hanz Fernando</h3>
          <p className="mt-2 text-[#3e4f62]">Full-Stack Developer</p>
        </div>

        <p className="retro-card p-3">
          Welcome to my home! I&apos;m a developer who builds web applications
          with modern tools and frameworks. I love clean code and pixel art.
        </p>

        <div className="retro-card space-y-2 p-3">
          <h4 className="pixel-font text-[10px] uppercase tracking-wide text-[#20334a] md:text-[11px]">Skills</h4>
          <div className="space-y-1.5">
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Frontend</span>React, Next.js, Tailwind CSS, TanStack</p>
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Backend</span>Node.js, Express, Prisma</p>
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Databases</span>MongoDB, Firebase, Supabase, MySQL, PostgreSQL</p>
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Languages</span>Javascript, Typescript, C#. Java, Python</p>
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Tools & Testing</span>Git, GitHub, Postman, Jest</p>
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Cloud & Deployment</span>AWS, Vercel, Render, Docker</p>
            <p><span className="retro-chip px-2 py-0.5 text-[10px] mr-2">Design</span>Figma, Canva</p>

          </div>
        </div>

        <button
          className="retro-btn retro-btn-accent pixel-font mt-2 px-4 py-2 text-[10px] uppercase"
          onClick={() => {
            onClose()
            handleProjectsClick()
          }}
        >
          See My Projects In The Lab
        </button>
      </div>
    </PanelBase>
  )
}
