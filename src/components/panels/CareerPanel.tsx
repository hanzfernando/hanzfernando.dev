'use client'
import { Briefcase } from 'lucide-react'
import Image from 'next/image'
import PanelBase from '@/components/panels/PanelBase'
import { careerExperiences } from '@/data/career'

interface CareerPanelProps {
  onClose: () => void
}

function CompanyLogo({ logo, company }: { logo?: string; company: string }) {
  if (logo) {
    return (
      <div className="relative min-w-12 h-12 border-2 border-[#182634] bg-[var(--off-white)] overflow-hidden flex-shrink-0">
        <Image
          src={logo}
          alt={company}
          fill
          className="object-contain p-1"
          onError={(e) => {
            // hide broken image, parent will show fallback via CSS
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-w-12 h-12 flex items-center justify-center border-2 border-[#182634] bg-[var(--off-white)] flex-shrink-0">
      <Briefcase color="#1E293B" fill="#1E293B" strokeWidth={2} stroke="var(--off-white)" size={28} />
    </div>
  )
}

function StatusBadge({ period }: { period: string }) {
  const isCurrent = period.toLowerCase().includes('present')
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] border-2 border-[#182634] font-semibold uppercase tracking-wide ${
        isCurrent
          ? 'bg-[#d4f7e4] text-[#1a6640]'
          : 'bg-[#f3dfaa] text-[#6b4c10]'
      }`}
    >
      {isCurrent && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2a9865] animate-pulse" />
      )}
      {isCurrent ? 'Current' : 'Previous'}
    </span>
  )
}

export default function CareerPanel({ onClose }: CareerPanelProps) {
  return (
    <PanelBase title="Route 101 — Career" onClose={onClose}>
      <div className="relative pl-6 text-[12px] md:text-[13px]">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-2 top-0 w-1 border-x-2 border-[#182634] bg-[#ecd9a4]" />

        <div className="space-y-5">
          {careerExperiences.map((exp) => (
            <div key={exp.period} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[20px] top-4 h-3 w-3 border-2 border-[#182634] bg-[#f0c34f]" />

              <div className="retro-card overflow-hidden">
                {/* Card header row */}
                <div className="flex items-stretch gap-0 border-b-2 border-[#182634]">
                  {/* Logo block */}

                  {/* Title + meta */}
                  <div className="flex flex-1 gap-2 px-3 py-2 bg-gradient-to-b from-[#fff9e9] to-[#f3dfaa]">
                    <CompanyLogo logo={exp.logo} company={exp.company} />
                    <div className="flex flex-1 flex-col justify-center gap-0.5">
                      <h3 className="pixel-font text-[10px] md:text-[11px] uppercase tracking-wide text-[#213551] leading-tight">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#2a3949] text-[12px]">
                          {exp.company}
                        </span>
                        
                        <StatusBadge period={exp.period} />
                      </div>
                    </div>
                     <span className="h-6 px-2 py-0.5 text-xs">
                      {exp.period}
                    </span>

                  </div>
                </div>

                {/* Body */}
                <div className="px-3 py-2.5 space-y-2 bg-[#fffef9]">
                  {/* Period chip */}
                  <div className="flex items-center gap-1.5">
                   
                  </div>
                  <p className="text-[#2a3949] leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelBase>
  )
}