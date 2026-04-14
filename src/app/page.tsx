'use client'

import AboutSection from '@/components/portfolio/sections/AboutSection'
import ContactSection from '@/components/portfolio/sections/ContactSection'
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection'
import PortfolioFooter from '@/components/portfolio/sections/PortfolioFooter'
import PortfolioHeader from '@/components/portfolio/sections/PortfolioHeader'
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection'
import SkillsSection from '@/components/portfolio/sections/SkillsSection'

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
    </div>
  )
}

export default Page