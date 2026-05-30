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
              {techs.map(({ name, icon: Icon, color, isMain }) => (
                <span
                  key={name}
                  className={`inline-flex items-center gap-1.5 border font-geist text-sm px-2 py-0.5 transition-colors ${
                    isMain
                      ? 'border-[var(--main)]/50 bg-[var(--main)]/10 text-[var(--main)]'
                      : 'border-white/10 bg-white/[0.03] text-white/55 hover:text-white/75'
                  }`}
                >
                  <Icon size={13} style={isMain ? undefined : { color }} aria-hidden />
                  {name}
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
