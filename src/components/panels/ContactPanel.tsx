'use client'

import PanelBase from '@/components/panels/PanelBase'

interface ContactPanelProps {
  onClose: () => void
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  return (
    <PanelBase title="Mailbox" onClose={onClose}>
      <div className="space-y-3 text-[12px] md:text-[13px]">
        <p className="retro-card p-3 text-[#334659]">Get in touch!</p>
        <div className="space-y-2.5">
          <p className="retro-card px-3 py-2.5">
            <span className="retro-chip mr-2 px-2 py-0.5 text-[10px]">MAIL</span>
            <a href="mailto:hello@hanzfernando.dev" className="retro-link break-all">
              fernandohanz23@gmail.com
            </a>
          </p>
          <p className="retro-card px-3 py-2.5">
            <span className="retro-chip mr-2 px-2 py-0.5 text-[10px]">GH</span>
            <a href="https://github.com/hanzfernando" className="retro-link break-all" target="_blank" rel="noopener noreferrer">
              github.com/hanzfernando
            </a>
          </p>
          <p className="retro-card px-3 py-2.5">
            <span className="retro-chip mr-2 px-2 py-0.5 text-[10px]">LI</span>
            <a href="https://www.linkedin.com/in/hanz-fernando/" className="retro-link break-all" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/hanz-fernando
            </a>
          </p>
        </div>
      </div>
    </PanelBase>
  )
}
