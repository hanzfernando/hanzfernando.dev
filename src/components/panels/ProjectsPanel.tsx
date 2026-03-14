'use client'

import PanelBase from '@/components/panels/PanelBase'
import { projects } from '@/data/projects'
import Image from 'next/image'

interface ProjectsPanelProps {
  onClose: () => void
}

export default function ProjectsPanel({ onClose }: ProjectsPanelProps) {
  const featuredProjects = projects.filter((project) => project.isFeatured)

  return (
    <PanelBase title="Projects" onClose={onClose}>
      <div className="space-y-5 text-[#202f42]">
        {/* Banner */}
        <div className="retro-card flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[12px] leading-relaxed md:text-[13px]">
              Built projects across full-stack web, Android, and real-time dashboards...
            </p>
            <p className="mt-2 text-[12px] font-semibold text-[#234978] md:text-[13px]">
              Featured: {featuredProjects.length} / {projects.length}
            </p>
          </div>
          <div className="retro-chip pixel-font flex-shrink-0 px-3 py-2 text-center text-[8px] leading-relaxed">
            {featuredProjects.length} / {projects.length}
            <br />
            FEATURED
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="retro-card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative h-40 w-full overflow-hidden border-b-2 border-[#111827] bg-[#dbe6ff]">
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} preview`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  width={500}
                  height={200}
                />
                {project.isFeatured && (
                  <span className="pixel-font absolute left-2 top-2 border-2 border-[#111827] bg-[#f0c34f] px-1.5 py-0.5 text-[7px] uppercase tracking-wide text-[#3d2f11] shadow-[2px_2px_0_#0e1724]">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-3">
                <div>
                  <h3 className="line-clamp-2 text-[14px] font-semibold text-[#1e3553]">
                    {project.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-[#33475b]">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tagUrl, index) => (
                    <picture key={`${project.id}-tag-${index}`}>
                      <img
                        src={tagUrl}
                        alt="Tech badge"
                        className="h-5 w-auto border-2 border-[#111827] bg-white"
                        loading="lazy"
                        width={50}
                        height={20}
                      />
                    </picture>
                  ))}
                </div>

                {/* Learning points */}
                <div className="flex-1">
                  <h4 className="pixel-font mb-1.5 text-[7.5px] uppercase tracking-wide text-[#2c4d76]">
                    What I Learned
                  </h4>
                  <ul className="list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-[#33475b]">
                    {project.learningPoints.slice(0, 3).map((point, pointIndex) => (
                      <li key={`${project.id}-point-${pointIndex}`}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="border-t-2 border-[#111827] bg-gradient-to-b from-[#f5ebcc] to-[#ede0b0] -mx-3 -mb-3 px-3 py-2.5">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-btn pixel-font inline-flex px-3 py-1.5 text-[8px] uppercase"
                    >
                      View Project
                    </a>
                  ) : (
                    <span className="inline-flex border-2 border-[#111827] bg-gradient-to-b from-[#d7dfec] to-[#c2cede] px-2.5 py-1 text-[11px] text-[#445669] shadow-[2px_2px_0_#0e1724]">
                      🔒 Private / Internal
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PanelBase>
  )
}