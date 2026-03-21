export type SkillCategory = {
  label: string
  techs: string[]
}

export const skillCategories: SkillCategory[] = [
  { label: 'Frontend', techs: ['React', 'Next.js', 'Tailwind CSS', 'TanStack'] },
  { label: 'Backend', techs: ['Node.js', 'Express', 'Prisma'] },
  {
    label: 'Databases',
    techs: ['MongoDB', 'Firebase', 'Supabase', 'MySQL', 'PostgreSQL'],
  },
  {
    label: 'Languages',
    techs: ['JavaScript', 'TypeScript', 'C#', 'Java', 'Python'],
  },
  { label: 'Tools & Testing', techs: ['Git', 'GitHub', 'Postman', 'Jest'] },
  { label: 'Cloud & Deployment', techs: ['AWS', 'Vercel', 'Render', 'Docker'] },
  { label: 'Design', techs: ['Figma', 'Canva'] },
]
