'use client'

import PanelBase from '@/components/panels/PanelBase'

interface ContactPanelProps {
  onClose: () => void
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  return (
    <PanelBase title="Resume" onClose={onClose}>
      <div className="space-y-3 text-[12px] md:text-[13px]">
        <iframe
          src="https://drive.google.com/file/d/1IhpaPNk-HnLWzHqIB4tDdu_xguuFoG92/preview"
          className="h-[70vh] w-full rounded border-2 border-[#182634]"
          allow="autoplay"
        />
      </div>
    </PanelBase>
  )
}
