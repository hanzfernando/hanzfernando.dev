'use client'

import PanelBase from '@/components/panels/PanelBase'

interface CareerPanelProps {
  onClose: () => void
}

const experiences = [
  {
    role: 'Full-Stack Developer',
    company: 'Company A',
    period: '2023 — Present',
    description: 'Building scalable web applications with React and Node.js.',
  },
  {
    role: 'Frontend Developer',
    company: 'Company B',
    period: '2021 — 2023',
    description: 'Led frontend development for a SaaS platform serving 10K+ users.',
  },
  {
    role: 'Junior Developer',
    company: 'Company C',
    period: '2020 — 2021',
    description: 'Developed REST APIs and responsive web interfaces.',
  },
]

export default function CareerPanel({ onClose }: CareerPanelProps) {
  return (
    <PanelBase title="Route 101 — Career" onClose={onClose}>
      <div className="relative pl-6 text-xs">
        {/* Timeline line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300" />

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.period} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-gray-900 rounded-full" />
              <h3 className="font-bold">{exp.role}</h3>
              <p className="text-gray-600">
                {exp.company} · {exp.period}
              </p>
              <p className="mt-1 text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PanelBase>
  )
}
