'use client'

import type { KeyboardEvent, MouseEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Briefcase, Gamepad2, Github, Linkedin, MapPin, Newspaper } from 'lucide-react'

const PortfolioHeader = () => {
  const router = useRouter()

  const navigateTo = (href: string) => {
    if (href.startsWith('/')) {
      router.push(href)
      return
    }

    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const handleActionsClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const item = target.closest('[data-href]') as HTMLElement | null

    if (!item) {
      return
    }

    const href = item.dataset.href
    if (!href) {
      return
    }

    navigateTo(href)
  }

  const handleActionKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()

    const href = event.currentTarget.dataset.href
    if (!href) {
      return
    }

    navigateTo(href)
  }

  return (
    <section>
      <div className='flex'>
        <Image
          src='/hanz.png'
          alt='Profile Picture'
          width={500}
          height={500}
          className='w-40 h-40 mr-4 object-cover'
        />

        <div className='flex flex-col justify-between'>
          <div>
            <h1 className='md:text-3xl text-2xl font-bold mb-2 font-mono'>Hanz Fernando</h1>
            <div>
              <MapPin className='inline mr-2' size={16} />
              <span className='text-sm mb-2'>Philippines</span>
            </div>
            <div>
              <Briefcase className='inline mr-2' size={16} />
              <span className='text-sm'>Software Engineer</span>
            </div>
          </div>

          <div className='flex mt-2 flex-wrap gap-2 sm:gap-4' onClick={handleActionsClick}>
            <div
              className='border-2 py-1 px-2 cursor-pointer'
              data-href='https://github.com/hanzfernando'
              role='link'
              tabIndex={0}
              onKeyDown={handleActionKeyDown}
            >
              <Github className='inline' size={16} />
              <span className='ml-2 text-sm hover:underline hidden sm:inline'>
                GitHub
              </span>
            </div>
            <div
              className='border-2 py-1 px-2 cursor-pointer'
              data-href='https://www.linkedin.com/in/hanz-fernando/'
              role='link'
              tabIndex={0}
              onKeyDown={handleActionKeyDown}
            >
              <Linkedin className='inline' size={16} />
              <span className='ml-2 text-sm hover:underline hidden sm:inline'>
                LinkedIn
              </span>
            </div>
            <div
              className='border-2 py-1 px-2 cursor-pointer'
              data-href='https://drive.google.com/file/d/1IhpaPNk-HnLWzHqIB4tDdu_xguuFoG92/view?usp=drive_link'
              role='link'
              tabIndex={0}
              onKeyDown={handleActionKeyDown}
            >
              <Newspaper className='inline' size={16} />
              <span className='ml-2 text-sm hover:underline hidden sm:inline'>
                Resume
              </span>
            </div>
            <div
              className='relative overflow-hidden border-2 border-amber-300/80 bg-linear-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 py-1 px-2 cursor-pointer text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.28)] transition-all hover:scale-[1.02] hover:shadow-[0_0_26px_rgba(251,191,36,0.5)]'
              data-href='/game'
              role='link'
              tabIndex={0}
              onKeyDown={handleActionKeyDown}
            >
              <span className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_55%)] pointer-events-none' />
              <Gamepad2 className='inline relative animate-pulse' size={16} />
              <span className='ml-2 text-[11px] tracking-[0.12em] uppercase hidden sm:inline text-amber-200/90'>
                ???
              </span>
              <span className='ml-2 text-sm font-semibold hover:underline hidden sm:inline relative'>
               Interactive Mode
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioHeader
