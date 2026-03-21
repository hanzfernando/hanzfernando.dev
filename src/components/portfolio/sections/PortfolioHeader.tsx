import Image from 'next/image'
import { Briefcase, Github, Linkedin, MapPin, Newspaper } from 'lucide-react'

const PortfolioHeader = () => {
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

          <div className='flex mt-2'>
            <div className='border border-2 py-1 px-2'>
              <Github className='inline' size={16} />
              <a href='https://github.com/hanzfernando' className='ml-2 text-sm hover:underline hidden sm:inline' target='_blank' rel='noopener noreferrer'>
                GitHub
              </a>
            </div>
            <div className='border border-2 py-1 px-2 ml-4'>
              <Linkedin className='inline' size={16} />
              <a href='https://www.linkedin.com/in/hanz-fernando/' className='ml-2 text-sm hover:underline hidden sm:inline' target='_blank' rel='noopener noreferrer'>
                LinkedIn
              </a>
            </div>
            <div className='border border-2 py-1 px-2 ml-4'>
              <Newspaper className='inline' size={16} />
              <a href='https://drive.google.com/file/d/1IhpaPNk-HnLWzHqIB4tDdu_xguuFoG92/view?usp=drive_link' className='ml-2 text-sm hover:underline hidden sm:inline' target='_blank' rel='noopener noreferrer'>
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioHeader
