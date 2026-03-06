'use client'

import PanelBase from '@/components/panels/PanelBase'

interface ProjectsPanelProps {
  onClose: () => void
}

const projects = [
  {
    title: 'Project Alpha',
    description: 'A full-stack web application built with Next.js and PostgreSQL.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Project Beta',
    description: 'Real-time collaboration tool with WebSocket support.',
    tech: ['React', 'Node.js', 'Socket.io', 'Redis'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Project Gamma',
    description: 'Mobile-first e-commerce platform with Stripe integration.',
    tech: ['React Native', 'Express', 'Stripe', 'MongoDB'],
    github: '#',
    demo: '#',
  },
]

export default function ProjectsPanel({ onClose }: ProjectsPanelProps) {
  return (
    <PanelBase title="Projects Lab" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.title} className="border-2 border-gray-300 p-3">
            <h3 className="text-xs font-bold mb-1">{project.title}</h3>
            <p className="text-xs text-gray-600 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {project.tech.map((t) => (
                <span key={t} className="bg-gray-200 px-1 text-xs text-gray-700">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-2 text-xs">
              <a href={project.github} className="text-blue-700 hover:underline">GitHub</a>
              <a href={project.demo} className="text-blue-700 hover:underline">Demo</a>
            </div>
          </div>
        ))}
      </div>
    </PanelBase>
  )
}
