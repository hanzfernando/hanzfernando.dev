import { skillCategories } from '@/data/skills'

const SkillsSection = () => {
  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <h2 className='text-2xl font-bold font-mono mb-4'>Skills</h2>
      <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
        {skillCategories.map(({ label, techs }) => (
          <div key={label}>
            <h3 className='font-bold font-mono text-sm mb-1'>{label}</h3>
            <div className='flex flex-wrap gap-1.5'>
              {techs.map((tech) => (
                <span key={tech} className='border font-geist text-sm px-2 py-0.5 opacity-80'>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
