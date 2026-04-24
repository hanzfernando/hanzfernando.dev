import React from 'react'
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
          {featuredProjects.map((project) => (
            <article key={project.id} className='border border-white/10 bg-black/20 p-3'>
              <div className='grid md:grid-cols-[200px_1fr] gap-3'>
                <div className='relative w-full h-28 md:h-full min-h-28 bg-black/25'>
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes='(max-width: 768px) 100vw, 200px'
                    className='object-cover'
                  />
                </div>

                <div>
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

                  <p className='mt-2 text-sm leading-relaxed opacity-85'>{project.shortDescription}</p>

                  <div className='mt-3 flex flex-wrap gap-1.5'>
                    {project.tags.map((tagUrl, index) => (
                      <TechBadge key={`${project.id}-tag-${index}`} tagUrl={tagUrl} />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='mt-4 bg-(--card) p-4'>
        <h2 className='text-xl font-bold mb-3 font-mono'>More Builds</h2>
        <div className='grid sm:grid-cols-2 gap-3'>
          {otherProjects.map((project) => (
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
              <p className='text-sm mt-2 leading-relaxed opacity-85'>{project.shortDescription}</p>

              <div className='mt-3 flex flex-wrap gap-1.5'>
                {project.tags.map((tagUrl, index) => (
                  <TechBadge key={`${project.id}-tag-${index}`} tagUrl={tagUrl} />
                ))}
              </div>

              {project.link ? (
                <a
                  href={project.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-3 inline-flex items-center gap-1 border border-white/15 px-2 py-1 text-xs hover:bg-white/10 transition-colors'
                >
                  Visit
                  <ExternalLink size={13} />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage