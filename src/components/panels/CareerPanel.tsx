'use client'

import PanelBase from '@/components/panels/PanelBase'
import { careerExperiences } from '@/data/career'

interface CareerPanelProps {
  onClose: () => void
}

export default function CareerPanel({ onClose }: CareerPanelProps) {
  return (
    <PanelBase title="Route 101 — Career" onClose={onClose}>
      <div className="relative pl-6 text-[12px] md:text-[13px]">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-2 top-0 w-1 border-x-2 border-[#182634] bg-[#ecd9a4]" />

        <div className="space-y-6">
          {careerExperiences.map((exp) => (
            <div key={exp.period} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[20px] top-2 h-3 w-3 border-2 border-[#182634] bg-[#f0c34f]" />
              <div className="retro-card space-y-1.5 px-3 py-2.5">
                <h3 className="pixel-font text-[12px] uppercase tracking-wide text-[#213551] md:text-[11px]">{exp.role}</h3>
                <p className="text-[#3f4f61]">
                  <span className="retro-chip mr-2 px-2 py-0.5 text-[12px]">{exp.company} · {exp.period}</span>
                 
                </p>
                <p className="text-[#2a3949]">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelBase>
  )
}
