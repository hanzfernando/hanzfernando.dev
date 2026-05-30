'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ExternalLink, Minus, Plus } from 'lucide-react'
import { projects, type PortfolioProject } from '@/data/projects'
import TechBadge from '@/components/portfolio/TechBadge'
import UseCaseBadge from '@/components/portfolio/UseCaseBadge'

const sortedProjects = [...projects].sort((a, b) => b.id - a.id)
const featuredProjects = sortedProjects.filter((project) => project.isFeatured)
const otherProjects = sortedProjects.filter((project) => !project.isFeatured)

const parseProjectDescription = (description: string) => {
  const [overviewText, contributionText = ''] = description.split('Key Contributions:')
  const overview = overviewText
    .trim()
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  const contributions = contributionText
    .split('\n')
    .map((line) => line.trim().replace(/^- /, ''))
    .filter(Boolean)

  return { overview, contributions }
}

type ProjectCardProps = {
  project: PortfolioProject
  isExpanded: boolean
  onToggle: (projectId: number) => void
  compact?: boolean
}

const ProjectCard = ({ project, isExpanded, onToggle, compact = false }: ProjectCardProps) => {
  const { overview, contributions } = parseProjectDescription(project.description)

  return (
    <article className='relative overflow-hidden border border-white/10 bg-black/20 transition-colors hover:border-white/20'>
      <div className={`grid gap-0 ${compact ? '' : 'md:grid-cols-[minmax(280px,360px)_1fr]'}`}>
        <div className='self-start bg-black/25 p-2'>
          <Image
            src={project.thumbnail}
            alt={`${project.title} screenshot`}
            width={800}
            height={600}
            sizes={compact ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 768px) 100vw, 360px'}
            className='h-auto w-full object-contain'
          />
        </div>

        <div className='flex flex-col p-4 md:pr-24'>
          <div className='mb-2'>
            <UseCaseBadge useCase={project.useCase} />
          </div>
          <h3 className='font-bold font-mono text-sm leading-snug md:text-base'>{project.title}</h3>
          <p className='mt-3 text-sm leading-relaxed opacity-85'>{project.shortDescription}</p>

          <div className='mt-4 border-t border-white/10 pt-3'>
            <p className='mb-2 font-mono text-[10px] uppercase tracking-widest opacity-45'>Stack</p>
            <div className='flex flex-wrap gap-1.5'>
              {project.tags.map((tagUrl, index) => (
                <TechBadge key={`${project.id}-tag-${index}`} tagUrl={tagUrl} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-1.5 px-4 pb-4 md:absolute md:right-3 md:top-3 md:p-0'>
        {project.link ? (
          <a
            href={project.link}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex h-8 items-center gap-1 border border-white/20 bg-black/35 px-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white'
          >
            Visit
            <ExternalLink size={13} />
          </a>
        ) : null}
        <button
          type='button'
          onClick={() => onToggle(project.id)}
          className='inline-flex h-8 w-8 items-center justify-center border border-white/20 bg-black/35 text-white/70 transition-colors hover:bg-white/10 hover:text-white'
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show less' : 'Learn more'}
        >
          {isExpanded ? <Minus size={15} /> : <Plus size={15} />}
        </button>
      </div>

      {isExpanded ? (
        <div className='border-t border-white/10 p-4'>
          <div className='grid gap-5 md:grid-cols-[0.9fr_1.1fr]'>
            <div>
              <h4 className='font-mono text-xs uppercase tracking-widest opacity-55'>Overview</h4>
              <div className='mt-2 space-y-3'>
                {overview.map((paragraph) => (
                  <p key={paragraph} className='text-sm leading-relaxed opacity-85'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {contributions.length > 0 ? (
              <div>
                <h4 className='font-mono text-xs uppercase tracking-widest opacity-55'>Key Contributions</h4>
                <ul className='mt-2 space-y-2'>
                  {contributions.map((contribution) => (
                    <li key={contribution} className='flex gap-2 text-sm leading-relaxed opacity-85'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-[var(--main)]' aria-hidden />
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  )
}

const ProjectsPage = () => {
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  const toggleExpanded = (projectId: number) => {
    setExpandedIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  return (
    <div className='max-w-4xl w-fill m-auto p-4'>
      <section className='bg-[var(--card)] p-4'>
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

      <section className='mt-4 bg-[var(--card)] p-4'>
        <h2 className='text-xl font-bold mb-3 font-mono'>Featured</h2>
        <div className='grid gap-3'>
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={expandedIds.includes(project.id)}
              onToggle={toggleExpanded}
            />
          ))}
        </div>
      </section>

      <section className='mt-4 bg-[var(--card)] p-4'>
        <h2 className='text-xl font-bold mb-3 font-mono'>More Builds</h2>
        <div className='grid gap-3 sm:grid-cols-2'>
          {otherProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={expandedIds.includes(project.id)}
              onToggle={toggleExpanded}
              compact
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage
