'use client'
import PanelBase from '@/components/panels/PanelBase'
import { contactInfo } from '@/data/contact'
import { ArrowRight } from 'lucide-react'

interface ContactPanelProps {
  onClose: () => void
}

const typeAccent: Record<string, { chipBg: string; chipText: string; decoration: string }> = {
  email:    { chipBg: '#d14545', chipText: '#fff',    decoration: '✉' },
  linkedin: { chipBg: '#245084', chipText: '#fff',    decoration: '💼' },
  github:   { chipBg: '#173257', chipText: '#fff',    decoration: '⌥' },
  phone:    { chipBg: '#2a9865', chipText: '#fff',    decoration: '☏' },
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  return (
    <PanelBase title="Mailbox" onClose={onClose}>
      <div className="space-y-4 text-[12px] md:text-[13px]">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          className="retro-card relative overflow-hidden py-2 px-3"
        >
          <div className='pl-2'>
            <span
              className="pixel-font text-[9px] tracking-[0.4em] uppercase text-(--nb-ink)/80"
            >
              📬 Drop a message
            </span>
            <p 
              className='mt-2 text-xs text-(--nb-ink) leading-loose tracking-wider'
            >
              I&apos;m always open to new opportunities, collabs, or just a chat.
              Pick your preferred channel below.
            </p>
          </div>
        </div>

        {/* ── Contact rows ─────────────────────────────────────────── */}
        <div className='flex flex-col gap-2'>
          {contactInfo.map(({ type, label, value, icon: Icon }) => {
            const accent = typeAccent[type] ?? { chipBg: '#5f8fc1', chipText: '#fff', decoration: '→' }
            const href =
              type === 'email' ? `mailto:${value}`
              : type === 'phone' ? `tel:${value}`
              : value
            const isExternal = type !== 'email' && type !== 'phone'

            // Friendly display value
            const display =
              type === 'linkedin' ? 'hanz-fernando'
              : type === 'github'   ? 'hanzfernando'
              : value

            return (
              <div
                key={type}
                style={{
                  boxShadow: '3px 3px 0 var(--nb-shadow-hard)',
                }}
                className="flex retro-card items-center gap-2 py-2 px-3"
              >
                {/* Platform chip */}
                <span
                  style={{
                    background: accent.chipBg,
                    color: accent.chipText,
                    border: '2px solid var(--nb-stroke)',
                    boxShadow: '2px 2px 0 var(--nb-shadow-hard)',
                  }}
                  className="pixel-font inline-flex items-center justify-center gap-1 text-[8px] py-1 px-2 text-nowrap shrink-0 uppercase tracking-[0.08em]"
                >
                  <Icon size={10} />
                  {label}
                </span>

                {/* Value + link */}
                <div className='flex-1 min-w-0'>
                  <a
                    href={href}
                    className="retro-link text-xs font-bold block text-(--nb-link) overflow-hidden text-overflow-ellipsis whitespace-nowrap"
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {display}
                  </a>
                  <span
                    className='text-[10px] text-(--nb-ink)/50 block overflow-hidden text-overflow-ellipsis whitespace-nowrap '
                  >
                    {value}
                  </span>
                </div>

                {/* Arrow indicator */}
                <ArrowRight size={14} color={accent.chipBg} className='text-(--nb-ink)/70 shrink-0' />
              </div>
            )
          })}
        </div>

        {/* ── Footer note ──────────────────────────────────────────── */}
        <div className="border-2 border-dashed border-(--nb-stroke) bg-transparent py-3 px-2 flex items-center gap-2">
          
          <span style={{ fontSize: 14 }}>⏱</span>
          <span
            
            className='text-xs text-(--nb-ink)/60 italic'
          >
            Usually replies within 24 hours.
          </span>
        </div>

      </div>
    </PanelBase>
  )
}