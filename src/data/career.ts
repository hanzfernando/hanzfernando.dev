export type CareerExperience = {
  role: string
  company: string
  period: string
  description: string
  logo?: string
}

export const careerExperiences: CareerExperience[] = [
  {
    role: 'Junior Full-Stack Developer',
    company: 'Kloudtech Corp',
    period: 'Sept 2025 - Present',
    description:
      'Working at Kloudtech Corp as a Junior Full Stack Developer, building and maintaining modern web applications.',
    logo: '/company/kloudtech.png',
    },
  {
    role: 'IT Student Trainee',
    company: 'Sumi Philippines Wiring Systems Corp.',
    period: 'Sept 2024 - Oct 2024',
    description:
      'Intern at Sumi Philippines Wiring Systems Corp. Led intern team, built Material Release Log, and developed Meeting Logging Web App.',
  },
  
]
