import Image from 'next/image'
import { Briefcase } from 'lucide-react'
import { careerExperiences } from '@/data/career'

const ExperienceSection = () => {
  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <h2 className='text-2xl font-bold mb-4 font-mono'>Experiences</h2>
      <div className='space-y-3'>
        {careerExperiences.map((experience) => (
          <article key={`${experience.company}-${experience.period}`} className='p-3'>
            <div className='flex items-center gap-3'>
              {experience.logo ? (
                <Image
                  src={experience.logo}
                  alt={experience.company}
                  width={50}
                  height={50}
                  className='w-12 h-12 object-contain'
                />
              ) : (
                <div className='min-w-12 h-12 flex items-center justify-center bg-[var(--off-white)]'>
                  <Briefcase color='#1E293B' fill='#1E293B' strokeWidth={2} stroke='var(--off-white)' size={32} />
                </div>
              )}
              <div>
                <h3 className='font-bold font-mono text-sm'>{experience.role}</h3>
                <p className='text-xs mt-1 opacity-80'>
                  {experience.company} · {experience.period}
                </p>
              </div>
            </div>

            <p className='text-sm mt-2 leading-relaxed'>{experience.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection
