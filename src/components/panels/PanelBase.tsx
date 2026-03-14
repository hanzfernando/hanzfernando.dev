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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />

      {/* Panel */}
      <div className="poke-window poke-soft-pattern relative z-10 mx-4 flex max-h-[84vh] w-full max-w-6xl flex-col rounded-md border-4 shadow-[0_10px_0_#172548,0_18px_30px_rgba(0,0,0,0.38)]">
        {/* Header */}
        <div className="poke-window-header flex items-center justify-between border-b-2 border-[#1a2c58] px-4 py-2.5">
          <h2 className="pixel-font text-[12px] uppercase tracking-wide text-white">{title}</h2>
          <button
            className="rounded border border-[#efdac4] bg-[#c74f4f] px-3 py-1 text-[13px] font-semibold text-white transition-colors hover:bg-[#b44343]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-slate-800 md:p-6">{children}</div>
      </div>
    </div>
  )
}
