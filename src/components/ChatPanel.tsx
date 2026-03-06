'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const [lastReadIdx, setLastReadIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const activePanel = useGameStore((s) => s.activePanel)
  const chatMessages = useGameStore((s) => s.chatMessages)

  const unreadCount = isOpen ? 0 : chatMessages.length - lastReadIdx

  const emitFocus = useCallback(async (focused: boolean) => {
    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.CHAT_FOCUS, focused)
  }, [])

  const openInput = useCallback(() => {
    setInputActive(true)
    emitFocus(true)
  }, [emitFocus])

  const closeInput = useCallback(() => {
    setInputActive(false)
    setValue('')
    emitFocus(false)
  }, [emitFocus])

  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed) return
    const { EventBus, GameEvents } = await import('@/game/EventBus')
    EventBus.emit(GameEvents.CHAT_SENT, trimmed)
    setValue('')
    closeInput()
  }, [value, closeInput])

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        // Closing: mark all current messages as read
        setLastReadIdx(chatMessages.length)
      }
      return !prev
    })
  }, [chatMessages.length])

  // Scroll to bottom on new messages while panel is open
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [chatMessages, isOpen])

  // Focus input field when activated
  useEffect(() => {
    if (inputActive) inputRef.current?.focus()
  }, [inputActive])

  // Enter opens the panel + input; Escape closes just the input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (activePanel) return
      if (e.key === 'Enter' && !inputActive) {
        e.preventDefault()
        setIsOpen(true)
        openInput()
      } else if (e.key === 'Escape' && inputActive) {
        e.preventDefault()
        closeInput()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inputActive, activePanel, openInput, closeInput])

  return (
    <div className="absolute top-9 left-3 z-40 flex flex-col items-start">
      {/* Toggle button with unread badge */}
      <div className="relative">
        <button
          className="w-7 h-7 bg-black/60 border border-white/20 text-sm flex items-center justify-center hover:bg-black/80 transition-colors select-none"
          onClick={togglePanel}
          title="Toggle Chat (Enter)"
        >
          💬
        </button>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center px-px font-bold leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Chat panel — expands downward from the icon */}
      {isOpen && (
        <div className="mt-1 w-52 bg-black/75 border border-white/20 flex flex-col">
          {/* Messages history */}
          <div className="h-32 overflow-y-auto p-1.5 flex flex-col gap-0.5">
            {chatMessages.length === 0 ? (
              <span className="text-white/30 text-xs italic">No messages yet...</span>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className="text-xs text-white leading-snug break-words">
                  <span className="text-yellow-300 font-semibold">{msg.username}</span>
                  <span className="text-white/50">: </span>
                  <span>{msg.message}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          {inputActive ? (
            <div className="flex border-t border-white/20">
              <input
                ref={inputRef}
                className="flex-1 min-w-0 bg-transparent px-2 py-1 text-xs text-white outline-none placeholder-white/30"
                maxLength={100}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') handleSend()
                  if (e.key === 'Escape') closeInput()
                }}
                placeholder="Type a message..."
              />
              <button
                className="px-2 py-1 text-xs text-white/60 hover:text-white border-l border-white/20 hover:bg-white/10 transition-colors"
                onClick={handleSend}
              >
                ↵
              </button>
            </div>
          ) : (
            <button
              className="border-t border-white/20 px-2 py-1 text-xs text-white/30 hover:text-white/60 text-left transition-colors"
              onClick={openInput}
            >
              Enter to chat
            </button>
          )}
        </div>
      )}
    </div>
  )
}
