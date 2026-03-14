'use client'

import { useEffect, useCallback } from 'react'

interface PanelBaseProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function PanelBase({ title, onClose, children }: PanelBaseProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-2 md:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a1322]/70 backdrop-blur-[1px]" onClick={onClose} />

      {/* Panel */}
      <div className="retro-panel retro-scanlines float-fade-in relative z-10 flex max-h-[86vh] w-full max-w-6xl flex-col overflow-hidden">
        {/* Header */}
        <div className="retro-panel-header flex items-center justify-between px-4 py-2.5 md:px-5 md:py-3">
          <h2 className="pixel-font text-[10px] uppercase tracking-wide text-white md:text-[11px]">
            {title}
          </h2>
          <button
            className="retro-btn retro-btn-danger pixel-font px-2.5 py-1 text-[9px] uppercase"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 text-[13px] text-[#1b2735] md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}