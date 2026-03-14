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
      <div className="space-y-5 text-[11px] text-slate-800">
        <div className="rounded-md border-2 border-[#2e4b8b] bg-[#fffdf4] px-4 py-3 shadow-[inset_0_-2px_0_#e6dec5]">
          <p className="text-[13px] leading-relaxed">
            Built projects across full-stack web, Android, and real-time dashboards...
          </p>
          <p className="mt-1.5 text-[13px] font-medium text-[#35508e]">
            Featured: {featuredProjects.length} / {projects.length}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-md border-2 border-[#325392] bg-[#fffef7] shadow-[0_3px_0_#213a6f] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="relative h-40 w-full overflow-hidden border-b-2 border-[#325392] bg-[#dbe6ff]">
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} preview`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  width={500}
                  height={200}
                />
                {project.isFeatured && (
                  <span className="pixel-font absolute left-2 top-2 rounded-sm border border-[#8d6f19] bg-[#f6ca4c] px-1.5 py-0.5 text-[8px] uppercase tracking-wide text-[#4a390b]">
                    Featured
                  </span>
                )}
              </div>

              <div className="space-y-3 p-3">
                <div>
                  <h3 className="line-clamp-2 text-base font-semibold text-[#1d325f]">{project.title}</h3>
                  <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-slate-700">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tagUrl, index) => (
                    <picture
                      key={`${project.id}-tag-${index}`}>
                      <img
                        src={tagUrl}
                        alt="Tech badge"
                        className="h-5 w-auto rounded-sm border border-[#d8d8d8] bg-white"
                        loading="lazy"
                        width={50}
                        height={20}
                      />
                    </picture>

                  ))}

                </div>

                <div>
                  <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#35508e]">
                    What I Learned
                  </h4>
                  <ul className="list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-slate-700">
                    {project.learningPoints.slice(0, 3).map((point, pointIndex) => (
                      <li key={`${project.id}-point-${pointIndex}`}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#cad7f6] pt-2">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-sm border border-[#28437f] bg-[#3f63b5] px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-[#3557a3]"
                    >
                      View Project
                    </a>
                  ) : (
                    <span className="inline-flex rounded-sm border border-[#b6bcc9] bg-[#edf0f7] px-2.5 py-1 text-[11px] text-slate-600">
                      Private / Internal
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
