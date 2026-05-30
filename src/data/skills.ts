import type { IconType } from 'react-icons'
import { FaAws } from 'react-icons/fa'
import {
  SiCanva,
  SiSharp,
  SiDocker,
  SiExpo,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiJavascript,
  SiJest,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiReact,
  SiReactquery,
  SiRender,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import NativeWindIcon from '@/components/shared/NativeWindIcon'

export type Tech = {
  name: string
  icon: IconType
  color: string
  isMain?: boolean
}

export type SkillCategory = {
  label: string
  techs: Tech[]
}

const tech = (name: string, icon: IconType, color: string, isMain = false): Tech => ({
  name,
  icon,
  color,
  isMain,
})

export const skillCategories: SkillCategory[] = [
  {
    label: 'Frontend',
    techs: [
      tech('React', SiReact, '#61DAFB', true),
      tech('React Native', SiReact, '#61DAFB'),
      tech('Next.js', SiNextdotjs, '#000000', true),
      tech('Tailwind CSS', SiTailwindcss, '#06B6D4'),
      tech('NativeWind', NativeWindIcon, '#06B6D4'),
      tech('TanStack', SiReactquery, '#FF4154'),
      tech('ShadCN UI', SiShadcnui, '#000000'),
    ],
  },
  {
    label: 'Backend',
    techs: [
      tech('Node.js', SiNodedotjs, '#339933', true),
      tech('Express', SiExpress, '#000000'),
      tech('Prisma', SiPrisma, '#2D3748', true),
    ],
  },
  {
    label: 'Databases',
    techs: [
      tech('MongoDB', SiMongodb, '#47A248'),
      tech('Firebase', SiFirebase, '#FFCA28'),
      tech('Supabase', SiSupabase, '#3ECF8E'),
      tech('MySQL', SiMysql, '#4479A1'),
      tech('PostgreSQL', SiPostgresql, '#4169E1', true),
    ],
  },
  {
    label: 'Languages',
    techs: [
      tech('JavaScript', SiJavascript, '#F7DF1E'),
      tech('TypeScript', SiTypescript, '#3178C6', true),
      tech('C#', SiSharp, '#239120'),
      tech('Java', FaJava, '#ED8B00'),
      tech('Python', SiPython, '#3776AB'),
    ],
  },
  {
    label: 'Tools & Testing',
    techs: [
      tech('Git', SiGit, '#F05032'),
      tech('GitHub', SiGithub, '#181717'),
      tech('Postman', SiPostman, '#FF6C37'),
      tech('Jest', SiJest, '#C21325'),
      tech('Expo Go', SiExpo, '#000020'),
    ],
  },
  {
    label: 'Cloud & Deployment',
    techs: [
      tech('AWS', FaAws, '#FF9900', true),
      tech('Vercel', SiVercel, '#000000'),
      tech('Render', SiRender, '#46E3B7'),
      tech('Docker', SiDocker, '#2496ED', true),
    ],
  },
  {
    label: 'Design',
    techs: [
      tech('Figma', SiFigma, '#F24E1E'),
      tech('Canva', SiCanva, '#00C4CC'),
    ],
  },
]
