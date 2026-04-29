'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { projects } from '@/data/projects'
import TechBadge from '@/components/portfolio/TechBadge'
import UseCaseBadge from '@/components/portfolio/UseCaseBadge'

const sortedProjects = [...projects].sort((a, b) => b.id - a.id)
const featuredProjects = sortedProjects.filter((project) => project.isFeatured)
const otherProjects = sortedProjects.filter((project) => !project.isFeatured)

const ProjectsPage = () => {
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  const toggleExpanded = (projectId: number) => {
    setExpandedIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  return (
    <div className='max-w-4xl w-fill m-auto p-4'>
      <section className='bg-(--card) p-4'>
        <div className='flex items-start justify-between gap-3'>
          <h1 className='text-2xl font-bold font-mono'>All Projects</h1>
          <Link
            href='/'
            className='inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors whitespace-nowrap'
          >
            <ArrowLeft size={15} />
            <span className='hidden md:block'>Back to Portfolio</span>
          </Link>
        </div>
        <p className='mt-2 text-sm opacity-85 leading-relaxed'>
          A complete list of projects, with featured work highlighted first.
        </p>
      </section>

      <section className='mt-4 bg-(--card) p-4'>
        <h2 className='text-xl font-bold mb-3 font-mono'>Featured</h2>
        <div className='grid gap-3'>
          {featuredProjects.map((project) => {
            const isExpanded = expandedIds.includes(project.id)

            return (
            <article key={project.id} className='border border-white/10 bg-black/20 p-3'>
              <div className='grid gap-3 md:grid-cols-[320px_1fr]'>
                <div className='w-full bg-black/25'>
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    width={800}
                    height={600}
                    className='h-auto w-full object-contain'
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
                    {project.tags.map((tagUrl, index) => (
                      <TechBadge key={`${project.id}-tag-${index}`} tagUrl={tagUrl} />
                    ))}
                  </div>

                  <div className='relative flex-1 mt-2 flex items-center justify-between gap-3'>
                    <p className='text-sm leading-relaxed opacity-85'>{project.shortDescription}</p>
                    <button
                      type='button'
                      onClick={() => toggleExpanded(project.id)}
                      className='absolute right-0 bottom-0 inline-flex h-6 w-6 items-center justify-center border border-white/20 text-[12px] text-white/70 hover:text-white'
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Show less' : 'Learn more'}
                    >
                      {isExpanded ? '-' : '+'}
                    </button>
                  </div>

                  
                </div>
              </div>

              {isExpanded ? (
                <p className='mt-3 text-sm leading-relaxed opacity-85 whitespace-pre-line'>
                  {project.description}
                </p>
              ) : null}
            </article>
          )})}
        </div>
      </section>

      <section className='mt-4 bg-(--card) p-4'>
        <h2 className='text-xl font-bold mb-3 font-mono'>More Builds</h2>
        <div className='grid sm:grid-cols-2 gap-3'>
          {otherProjects.map((project) => {
            const isExpanded = expandedIds.includes(project.id)

            return (
            <article key={project.id} className='border border-white/10 bg-black/20 p-3'>
              <div className='relative w-full h-48 bg-black/25'>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes='(max-width: 640px) 100vw, 50vw'
                  className='object-cover'
                />
              </div>

              <h3 className='font-bold font-mono text-sm mt-3'>{project.title}</h3>
              <div className='mt-1'>
                <UseCaseBadge useCase={project.useCase} />
              </div>

              <div className='mt-3 flex flex-wrap gap-1.5'>
                {project.tags.map((tagUrl, index) => (
                  <TechBadge key={`${project.id}-tag-${index}`} tagUrl={tagUrl} />
                ))}
              </div>

              <div className='mt-2 flex items-end justify-between gap-3'>
                <p className='text-sm leading-relaxed opacity-85'>{project.shortDescription}</p>
                <button
                  type='button'
                  onClick={() => toggleExpanded(project.id)}
                  className='ml-auto inline-flex h-6 w-10 items-center justify-center border border-white/20 text-[12px] text-white/70 hover:text-white'
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Show less' : 'Learn more'}
                >
                  {isExpanded ? '-' : '+'}
                </button>
              </div>

               {isExpanded ? (
                <p className='mt-3 text-sm leading-relaxed opacity-85 whitespace-pre-line'>
                  {project.description}
                </p>
              ) : null}

              {project.link ? (
                <a
                  href={project.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-3 inline-flex items-center gap-1 border border-white/15 px-2 py-2 text-xs hover:bg-white/10 transition-colors'
                >
                  Visit
                  <ExternalLink size={13} />
                </a>
              ) : null}
            </article>
          )})}
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage