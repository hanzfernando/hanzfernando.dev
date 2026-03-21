import { Mail, MessageSquare, User } from 'lucide-react'
import { contactInfo } from '@/data/contact'

const emailEntry = contactInfo.find((contact) => contact.type === 'email')
const emailAddress = emailEntry?.value ?? ''

const getHref = (type: string, value: string) => {
  if (type === 'email') {
    return `mailto:${value}`
  }

  if (type === 'phone') {
    return `tel:${value}`
  }

  return value
}

const isExternal = (type: string) => type !== 'email' && type !== 'phone'

const ContactSection = () => {
  return (
    <section className='mt-4 bg-[var(--card)] p-4'>
      <h2 className='text-2xl font-bold mb-4 font-mono'>Contact</h2>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <p className='text-sm leading-relaxed opacity-85'>
            Have a project in mind or just want to say hi? Feel free to reach out - I&apos;ll get back to you as soon as I can.
          </p>

          <div className='space-y-3 mt-4'>
            {contactInfo.map(({ type, label, value, icon: Icon }) => (
              <div key={type} className='flex items-center gap-3'>
                <div className='w-8 h-8 border border-white/20 flex items-center justify-center shrink-0'>
                  <Icon size={14} />
                </div>
                <div>
                  <p className='text-xs opacity-60 font-mono'>{label}</p>
                  {isExternal(type) ? (
                    <a
                      href={getHref(type, value)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm hover:underline'
                    >
                      {value}
                    </a>
                  ) : type === 'email' ? (
                    <a href={`mailto:${value}`} className='text-sm hover:underline'>
                      {value}
                    </a>
                  ) : (
                    <a href={`tel:${value}`} className='text-sm hover:underline'>
                      {value}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <div className='space-y-1'>
            <label className='text-xs font-mono opacity-60 flex items-center gap-1'>
              <User size={11} />
              Subject
            </label>
            <input
              id='contact-subject'
              type='text'
              placeholder='What is this about?'
              className='w-full bg-transparent border border-white/20 px-3 py-2 text-sm placeholder:opacity-40 focus:outline-none focus:border-white/50 transition-colors'
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-mono opacity-60 flex items-center gap-1'>
              <MessageSquare size={11} />
              Message
            </label>
            <textarea
              id='contact-body'
              rows={5}
              placeholder='Your message...'
              className='w-full bg-transparent border border-white/20 px-3 py-2 text-sm placeholder:opacity-40 focus:outline-none focus:border-white/50 transition-colors resize-none'
            />
          </div>

          <button
            type='button'
            onClick={() => {
              const subject = (document.getElementById('contact-subject') as HTMLInputElement)?.value || ''
              const body = (document.getElementById('contact-body') as HTMLTextAreaElement)?.value || ''
              window.open(`mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
            }}
            className='inline-flex items-center gap-2 border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition-colors w-full justify-center font-mono'
          >
            <Mail size={14} />
            Send Message
          </button>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
