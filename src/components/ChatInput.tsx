'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function ChatInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const activePanel = useGameStore((s) => s.activePanel)

  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed) return

    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.CHAT_SENT, trimmed)

    setValue('')
    setIsOpen(false)
  }, [value])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (activePanel) return

      if (e.key === 'Enter' && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        setValue('')
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, activePanel])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isOpen ? (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            className="w-48 border-2 border-gray-600 bg-black/80 px-2 py-1 text-xs text-white outline-none"
            maxLength={100}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder="Type a message..."
          />
          <button
            className="bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      ) : (
        <span className="text-xs text-white/50">ENTER to chat</span>
      )}
    </div>
  )
}
