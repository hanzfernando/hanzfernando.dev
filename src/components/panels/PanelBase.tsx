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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border-4 border-gray-800 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 bg-gray-900 px-4 py-2">
          <h2 className="text-xs text-white">{title}</h2>
          <button className="text-xs text-white hover:text-gray-300" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 text-gray-900">{children}</div>
      </div>
    </div>
  )
}
