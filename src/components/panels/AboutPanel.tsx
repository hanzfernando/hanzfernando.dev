'use client'

import PanelBase from '@/components/panels/PanelBase'
import { useGameStore } from '@/store/gameStore'

interface AboutPanelProps {
  onClose: () => void
}

export default function AboutPanel({ onClose }: AboutPanelProps) {
  const openPanel = useGameStore((s) => s.openPanel)

  return (
    <PanelBase title="About Me" onClose={onClose}>
      <div className="space-y-4 text-xs leading-relaxed">
        <div>
          <h3 className="text-sm font-bold">Hanz Fernando</h3>
          <p className="text-gray-600">Full-Stack Developer</p>
        </div>

        <p>
          Welcome to my home! I&apos;m a developer who builds web applications
          with modern tools and frameworks. I love clean code and pixel art.
        </p>

        <div>
          <h4 className="font-bold mb-1">Skills</h4>
          <div className="space-y-1">
            <p><span className="text-gray-600">Frontend:</span> React, Next.js, TypeScript, Tailwind CSS</p>
            <p><span className="text-gray-600">Backend:</span> Node.js, Python, PostgreSQL</p>
            <p><span className="text-gray-600">Tools:</span> Git, Docker, Vercel, AWS</p>
          </div>
        </div>

        <button
          className="mt-2 bg-gray-900 px-4 py-2 text-xs text-white hover:bg-gray-700"
          onClick={() => {
            onClose()
            openPanel('projects')
          }}
        >
          → See my projects in the Lab!
        </button>
      </div>
    </PanelBase>
  )
}
