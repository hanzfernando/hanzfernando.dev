import React from 'react'
import Image from 'next/image'
import { Briefcase, Github, Linkedin, MapPin, Newspaper } from 'lucide-react'
import { careerExperiences } from '@/data/career'
import { skillCategories } from '@/data/skills'

const page = () => {
  return (
    <div className='max-w-4xl w-fill m-auto p-4'>
      <section className=''>
        <div className='flex'>
          <Image
            src="/hanz.png"
            alt="Profile Picture"
            width={500}
            height={500}
            className="w-40 h-40 mr-4 object-cover"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className='text-3xl font-bold mb-2 font-mono'>Hanz Fernando</h1>
              <div>
                <MapPin className='inline mr-2' size={16} />
                <span className='text-sm mb-2'>Philippines</span>
              </div>
              <div>
                <Briefcase className='inline mr-2' size={16} />
                <span className='text-sm '>Software Engineer</span>
              </div>
            </div>

            <div className='flex mt-2'>
              <div className='border border-2 py-1 px-2'>
                <Github className='inline mr-2' size={16} />
                <a href="https://github.com/hanzfernando" className='text-sm hover:underline' target='_blank' rel='noopener noreferrer'>GitHub</a>
              </div>  
              <div className='border border-2 py-1 px-2 ml-4'>
                <Linkedin className='inline mr-2' size={16} />
                <a href="https://www.linkedin.com/in/hanz-fernando/" className='text-sm hover:underline' target='_blank' rel='noopener noreferrer'>LinkedIn</a>
              </div> 
              <div className='border border-2 py-1 px-2 ml-4'>
                <Newspaper className='inline mr-2' size={16} />
                <a href="https://drive.google.com/file/d/1IhpaPNk-HnLWzHqIB4tDdu_xguuFoG92/view?usp=drive_link" className='text-sm hover:underline' target='_blank' rel='noopener noreferrer'>Resume</a>
              </div> 
            </div>
                 
          </div>

        </div>

      </section>

      <section className='mt-4 bg-[var(--card)] p-4'>
        <h2 className='text-2xl font-bold mb-4 font-mono'>About</h2>
        <p className='text-sm leading-relaxed'>
          I&apos;m a software engineer with a passion for building modern softwares. With experience in both frontend and backend development, I enjoy solving problem and building scalable solutions. I&apos;m always eager to learn new technologies and collaborate on innovative ideas.
        </p>
      </section>

      <section className='mt-4 bg-[var(--card)] p-4'>
        <h2 className='text-2xl font-bold font-mono mb-4'>Skills</h2>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {skillCategories.map(({ label, techs }) => (
            <div key={label}>
              <h3 className='font-bold font-mono text-sm mb-1'>{label}</h3>
              <div className='flex flex-wrap gap-1.5'>
                {techs.map(tech => (
                  <span key={tech} className='border font-geist text-sm px-2 py-0.5 opacity-80'>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='mt-4 bg-[var(--card)] p-4'>
        <h2 className='text-2xl font-bold mb-4 font-mono'>Experiences</h2>
        <div className='space-y-3'>
          {careerExperiences.map((experience) => (
            <article key={`${experience.company}-${experience.period}`} className='border p-3'>
              <h3 className='font-bold font-mono text-sm'>{experience.role}</h3>
              <p className='text-xs mt-1 opacity-80'>
                {experience.company} · {experience.period}
              </p>
              <p className='text-sm mt-2 leading-relaxed'>{experience.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default page