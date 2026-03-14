'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { overlayLayout } from '@/components/overlayLayout'

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
    <div className={`absolute ${overlayLayout.chatAnchor} z-40 flex flex-col items-start`}>
      {/* Toggle button with unread badge */}
      <div className="relative">
        <button
          className="retro-btn flex h-8 w-8 items-center justify-center text-[13px] select-none"
          onClick={togglePanel}
          title="Toggle Chat (Enter)"
        >
          💬
        </button>
        {unreadCount > 0 && (
          <div className="pixel-font absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center border-2 border-[#111827] bg-[#d14545] px-[2px] text-[8px] leading-none text-white shadow-[2px_2px_0_#0e1724]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Chat panel — expands downward from the icon */}
      {isOpen && (
        <div className="pixel-font retro-pixel-surface float-fade-in mt-2 flex w-[min(16rem,calc(100vw-1.5rem))] flex-col">
          {/* Messages history */}
          <div className="h-40 overflow-y-auto p-2 text-[11px] flex flex-col gap-1">
            {chatMessages.length === 0 ? (
              <span className="text-[#4c5d70] italic">No messages yet...</span>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className="leading-snug break-words text-[#1d2b3a]">
                  <span className="pixel-font text-[9px] text-[#2c4f7a]">{msg.username}</span>
                  <span className="text-[#5b6c80]">: </span>
                  <span>{msg.message}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          {inputActive ? (
            <div className="flex border-t-2 border-[#111827] bg-[#f8eed0]">
              <input
                ref={inputRef}
                className="retro-input h-9 min-w-0 flex-1 px-2 py-1 text-[11px]"
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
                className="retro-btn border-l-2 border-[#111827] px-3 py-1 text-[11px]"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          ) : (
            <button
              className="pixel-font border-t-2 border-[#111827] bg-[#f8eed0] px-2 py-2 text-left text-[9px] text-[#27466f]"
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
