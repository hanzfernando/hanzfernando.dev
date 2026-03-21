'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function ChatInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const activePanel = useGameStore((s) => s.activePanel)

  // Notify Phaser when chat input is open/closed so movement is blocked
  const emitFocus = useCallback(async (open: boolean) => {
    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.CHAT_FOCUS, open)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
    emitFocus(true)
  }, [emitFocus])

  const close = useCallback(() => {
    setIsOpen(false)
    setValue('')
    emitFocus(false)
  }, [emitFocus])

  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed) return
    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.CHAT_SENT, trimmed)
    setValue('')
    close()
  }, [value, close])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (activePanel) return
      if (e.key === 'Enter' && !isOpen) {
        e.preventDefault()
        open()
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, activePanel, open, close])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  return (
    <div className="absolute bottom-3 left-3 z-40">
      {isOpen ? (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            className="retro-input w-56 px-2 py-1 text-[11px]"
            maxLength={100}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              // Stop propagation so Phaser never sees these keystrokes
              e.stopPropagation()
              if (e.key === 'Enter') handleSend()
              if (e.key === 'Escape') close()
            }}
            placeholder="Type a message..."
          />
          <button
            className="retro-btn pixel-font px-3 py-1 text-[9px] uppercase"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      ) : (
        <span className="retro-chip pixel-font px-2 py-1 text-[9px] uppercase">Enter To Chat</span>
      )}
    </div>
  )
}
