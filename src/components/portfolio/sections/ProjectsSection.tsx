'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import TechBadge from '@/components/portfolio/TechBadge'
import UseCaseBadge from '@/components/portfolio/UseCaseBadge'
import { projects } from '@/data/projects'

const featuredProjects = projects
  .filter((project) => project.isFeatured)
  .sort((a, b) => b.id - a.id)
  .slice(0, 3)

const ProjectsSection = () => {
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  const toggleExpanded = (projectId: number) => {
    setExpandedIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <div className='mb-4 flex items-start justify-between gap-3'>
        <h2 className='text-2xl font-bold font-mono'>Projects</h2>
        <Link
          href='/portfolio/projects'
          className='inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition-colors whitespace-nowrap'
        >
          More Projects
          <ArrowRight size={16} />
        </Link>
      </div>
      <p className='text-sm leading-relaxed opacity-85'>
        Selected projects with the biggest product and engineering impact.
      </p>

      <div className='mt-4 grid gap-3'>
        {featuredProjects.map((project, index) => {
          const isExpanded = expandedIds.includes(project.id)

          return (
          <article
            key={project.id}
            className={`border border-white/10 bg-black/20 p-3 ${index === 0 ? 'md:p-4' : ''}`}
          >
            <div className='grid gap-3 md:grid-cols-[320px_1fr]'>
              <div className='w-full bg-black/25'>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  width={800}
                  height={600}
                  className='w-full h-auto object-contain'
                />
              </div>

              <div className='flex flex-col'>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <h3 className='font-bold font-mono text-sm md:text-base'>{project.title}</h3>
                    <div className='mt-1'>
                      <UseCaseBadge useCase={project.useCase} />
                    </div>
                  </div>
                  {project.link ? (
                    <a
                      href={project.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='shrink-0 inline-flex items-center gap-1 border border-white/15 px-2 py-1 text-xs hover:bg-white/10 transition-colors'
                    >
                      Visit
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>

                <div className='mt-3 flex flex-wrap gap-1.5'>
                  {project.tags.map((tagUrl, tagIndex) => (
                    <TechBadge key={`${project.id}-tag-${tagIndex}`} tagUrl={tagUrl} />
                  ))}
                </div>

                <div className='relative flex-1 mt-2 flex items-center justify-between gap-3'>
                  <p className='text-sm opacity-85 leading-relaxed'>{project.shortDescription}</p>
                  <button
                    type='button'
                    onClick={() => toggleExpanded(project.id)}
                    className='absolute right-0 bottom-0 ml-auto inline-flex h-6 w-6 items-center justify-center border border-white/20 text-[12px] text-white/70 hover:text-white'
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Show less' : 'Learn more'}
                  >
                    {isExpanded ? '-' : '+'}
                  </button>
                </div>

                
              </div>
            </div>

            {isExpanded ? (
              <p className='mt-3 text-sm opacity-85 leading-relaxed whitespace-pre-line'>
                {project.description}
              </p>
            ) : null}
          </article>
        )})}
      </div>

    </section>
  )
}

export default ProjectsSection
