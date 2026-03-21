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
  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <h2 className='text-2xl font-bold mb-4 font-mono'>Projects</h2>
      <p className='text-sm leading-relaxed opacity-85'>
        Selected projects with the biggest product and engineering impact.
      </p>

      <div className='mt-4 grid gap-3'>
        {featuredProjects.map((project, index) => (
          <article
            key={project.id}
            className={`border border-white/10 bg-black/20 p-3 ${index === 0 ? 'md:p-4' : ''}`}
          >
            <div className='grid md:grid-cols-[190px_1fr] gap-3'>
              <div className='relative w-full h-28 md:h-full min-h-28 bg-black/25'>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 190px'
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

                <p className='mt-2 text-sm opacity-85 leading-relaxed'>{project.shortDescription}</p>

                <div className='mt-3 flex flex-wrap gap-1.5'>
                  {project.tags.map((tagUrl, tagIndex) => (
                    <TechBadge key={`${project.id}-tag-${tagIndex}`} tagUrl={tagUrl} />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className='mt-4'>
        <Link
          href='/portfolio/projects'
          className='inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition-colors'
        >
          More Projects
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

export default ProjectsSection
