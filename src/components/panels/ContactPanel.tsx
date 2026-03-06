'use client'

import PanelBase from '@/components/panels/PanelBase'

interface ContactPanelProps {
  onClose: () => void
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  return (
    <PanelBase title="Mailbox" onClose={onClose}>
      <div className="space-y-3 text-xs">
        <p className="text-gray-600">Get in touch!</p>
        <div className="space-y-2">
          <p>
            <span className="inline-block w-6">✉</span>
            <a href="mailto:hello@hanzfernando.dev" className="text-blue-700 hover:underline">
              hello@hanzfernando.dev
            </a>
          </p>
          <p>
            <span className="inline-block w-6">⌂</span>
            <a href="https://github.com/hanzfernando" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
              github.com/hanzfernando
            </a>
          </p>
          <p>
            <span className="inline-block w-6">▦</span>
            <a href="https://linkedin.com/in/hanzfernando" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/hanzfernando
            </a>
          </p>
        </div>
      </div>
    </PanelBase>
  )
}
