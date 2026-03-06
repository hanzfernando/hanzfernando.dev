'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function ChatInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const [canvasLeft, setCanvasLeft] = useState(16)
  const inputRef = useRef<HTMLInputElement>(null)
  const activePanel = useGameStore((s) => s.activePanel)

  // Track canvas left offset so the chat sits inside the game canvas, not the black bars
  useEffect(() => {
    function measure() {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        setCanvasLeft(rect.left + 12)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

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
    <div className="fixed bottom-3 z-40" style={{ left: canvasLeft }}>
      {isOpen ? (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            className="w-48 border-2 border-gray-600 bg-black/80 px-2 py-1 text-xs text-white outline-none"
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
