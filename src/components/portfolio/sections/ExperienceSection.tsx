'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Briefcase, CheckCircle2, Minus, Plus } from 'lucide-react'
import { careerExperiences } from '@/data/career'

const MOBILE_VISIBLE_HIGHLIGHTS = 2

const ExperienceSection = () => {
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const toggleExpanded = (experienceId: string) => {
    setExpandedIds((prev) =>
      prev.includes(experienceId)
        ? prev.filter((id) => id !== experienceId)
        : [...prev, experienceId]
    )
  }

  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <h2 className='text-2xl font-bold mb-4 font-mono'>Experiences</h2>
      <div className='divide-y divide-white/10 p-2'>
        {careerExperiences.map((experience) => {
          const experienceId = `${experience.company}-${experience.period}`
          const isExpanded = expandedIds.includes(experienceId)
          const mobileHighlights = isExpanded
            ? experience.highlights
            : experience.highlights.slice(0, MOBILE_VISIBLE_HIGHLIGHTS)
          const hasHiddenMobileHighlights = experience.highlights.length > MOBILE_VISIBLE_HIGHLIGHTS

          return (
            <article
              key={experienceId}
              className='py-4 first:pt-0 last:pb-0'
            >
              <div className='grid gap-4 md:grid-cols-[220px_1fr]'>
                <div>
                  <div className='flex items-center gap-3'>
                    {experience.logo ? (
                      <Image
                        src={experience.logo}
                        alt={experience.company}
                        width={50}
                        height={50}
                        className='w-12 h-12 object-contain bg-white p-1'
                      />
                    ) : (
                      <div className='min-w-12 h-12 flex items-center justify-center bg-[var(--off-white)]'>
                        <Briefcase color='#1E293B' fill='#1E293B' strokeWidth={2} stroke='var(--off-white)' size={32} />
                      </div>
                    )}
                    <div>
                      <h3 className='font-bold font-mono text-sm leading-snug'>{experience.role}</h3>
                      <p className='text-xs mt-1 opacity-70'>{experience.period}</p>
                    </div>
                  </div>

                  <p className='mt-3 text-sm font-semibold'>{experience.company}</p>
                </div>

                <div>
                  <p className='text-sm leading-relaxed opacity-85'>{experience.summary}</p>

                  <ul className='mt-3 space-y-2 md:hidden'>
                    {mobileHighlights.map((highlight) => (
                      <li key={highlight} className='flex gap-2 text-sm leading-relaxed opacity-85'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-[var(--main)]' aria-hidden />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className='mt-3 hidden space-y-2 md:block'>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight} className='flex gap-2 text-sm leading-relaxed opacity-85'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-[var(--main)]' aria-hidden />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {hasHiddenMobileHighlights ? (
                    <div className='mt-3 flex justify-end md:hidden'>
                      <button
                        type='button'
                        onClick={() => toggleExpanded(experienceId)}
                        className='inline-flex h-8 items-center gap-2 border border-white/20 bg-black/35 px-2.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white'
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                        {isExpanded ? 'Show less' : `Show ${experience.highlights.length - MOBILE_VISIBLE_HIGHLIGHTS} more`}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ExperienceSection
