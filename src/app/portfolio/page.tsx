'use client'
import AboutSection from '@/components/portfolio/sections/AboutSection'
import ContactSection from '@/components/portfolio/sections/ContactSection'
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection'
import PortfolioFooter from '@/components/portfolio/sections/PortfolioFooter'
import PortfolioHeader from '@/components/portfolio/sections/PortfolioHeader'
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection'
import SkillsSection from '@/components/portfolio/sections/SkillsSection'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const Page = () => {
  return (
    <div className='max-w-4xl w-fill m-auto p-4'>

      <PortfolioHeader />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      <PortfolioFooter />

      <Link
        href='/'
        className='fixed bottom-6 right-6 flex items-center gap-2 border border-white/20 bg-[var(--card)] px-3 py-2 text-xs font-mono hover:bg-white/10 transition-colors'
      >
        <ArrowLeft size={13} />
        Back
      </Link>
    </div>
  )
}

export default Page