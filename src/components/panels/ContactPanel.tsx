'use client'
import PanelBase from '@/components/panels/PanelBase'
import { contactInfo } from '@/data/contact'

interface ContactPanelProps {
  onClose: () => void
}

const typeChipLabel: Record<string, string> = {
  email: 'MAIL',
  linkedin: 'LI',
  github: 'GH',
  phone: 'TEL',
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  return (
    <PanelBase title="Mailbox" onClose={onClose}>
      <div className="space-y-3 text-[12px] md:text-[13px]">
        <p className="retro-card p-3 text-[#334659]">Get in touch!</p>
        <div className="space-y-2.5">
          {contactInfo.map(({ type, value }) => {
            const chip = typeChipLabel[type] ?? type.toUpperCase()
            const href =
              type === 'email'
                ? `mailto:${value}`
                : type === 'phone'
                ? `tel:${value}`
                : value

            return (
              <p key={type} className="retro-card px-3 py-2.5">
                <span className="retro-chip mr-2 px-2 py-0.5 text-[10px]">{chip}</span>
                <a
                  href={href}
                  className="retro-link break-all"
                  {...(type !== 'email' && type !== 'phone'
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {value}
                </a>
              </p>
            )
          })}
        </div>
      </div>
    </PanelBase>
  )
}