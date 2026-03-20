'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { EventBus, GameEvents } from '@/game/EventBus'
import { overlayLayout } from '@/components/overlays/overlayLayout'
import type { PanelType } from '@/store/gameStore'
import {
  User,
  FolderKanban,
  FileText,
  Briefcase,
  Mail,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  MapPin,
  Menu,
} from 'lucide-react'

type MenuAction = 'about' | 'projects' | 'career' | 'resume' | 'contact' | 'title'

const menuItems: Array<{ label: string; action: MenuAction; icon: React.ReactNode }> = [
  { label: 'About Me',     action: 'about',    icon: <User size={11} /> },
  { label: 'Projects',     action: 'projects', icon: <FolderKanban size={11} /> },
  { label: 'My Resume',    action: 'resume',   icon: <FileText size={11} /> },
  { label: 'My Career',    action: 'career',   icon: <Briefcase size={11} /> },
  { label: 'Contact',      action: 'contact',  icon: <Mail size={11} /> },
  { label: 'Back To Title',action: 'title',    icon: <ArrowLeft size={11} /> },
]

const menuTeleportTargets: Record<Exclude<MenuAction, 'title' | 'resume'>, { tileX: number; tileY: number }> = {
  about:   { tileX: 10, tileY: 9  },
  projects:{ tileX: 27, tileY: 10 },
  career:  { tileX: 4,  tileY: 15 },
  contact: { tileX: 8,  tileY: 13 },
}

export default function HUD() {
  const playerTileX = useGameStore((s) => s.playerTileX)
  const playerTileY = useGameStore((s) => s.playerTileY)
  const openPanel   = useGameStore((s) => s.openPanel)
  const resetToTitle= useGameStore((s) => s.resetToTitle)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setIsMenuOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const handleMenuAction = (action: MenuAction) => {
    setIsMenuOpen(false)
    if (action === 'title') {
      EventBus.emit(GameEvents.BACK_TO_TITLE)
      resetToTitle()
      return
    }
    if (action === 'resume') { openPanel('resume'); return }
    const target = menuTeleportTargets[action]
    EventBus.emit(GameEvents.TELEPORT_TO, target);
    (async () => {
      await new Promise((res) => setTimeout(res, 1400))
      openPanel(action as PanelType)
    })()
  }

  const handleMoveStart = (direction: 'up' | 'down' | 'left' | 'right') =>
    EventBus.emit(GameEvents.MOBILE_MOVE, { direction, isDown: true })

  const handleMoveEnd = (direction: 'up' | 'down' | 'left' | 'right') =>
    EventBus.emit(GameEvents.MOBILE_MOVE, { direction, isDown: false })

  const handleInteract = () => EventBus.emit(GameEvents.MOBILE_INTERACT)

  return (
    <>
      {/* Top-left: coords badge */}
      <div className={`pixel-font absolute ${overlayLayout.hudTopLeft} z-30 flex flex-col gap-2`}>
        <div className="retro-chip flex px-2 h-8 w-auto items-center justify-center gap-1.5 text-[9px] select-none">
          <MapPin size={9} />
          {`X: ${playerTileX ?? '--'}  Y: ${playerTileY ?? '--'}`}
        </div>
      </div>

      {/* Top-right: menu */}
      <div className={`absolute ${overlayLayout.hudTopRight} z-30 flex flex-col items-end gap-2 sm:flex-row sm:items-center`}>
        <div ref={menuRef} className="relative">
          <button
            className="retro-btn pixel-font px-2 h-8 text-[9px] uppercase flex items-center gap-1.5"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="Open menu"
          >
            <Menu size={11} />
            Menu
          </button>

          {isMenuOpen && (
            <div className="retro-pixel-surface pixel-font float-fade-in absolute right-0 top-10 z-40 min-w-[180px] p-1.5">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.action}
                    className="retro-btn px-2 py-1.5 text-left text-[9px] uppercase flex items-center gap-2"
                    onClick={() => handleMenuAction(item.action)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="absolute inset-0 z-30 md:hidden pointer-events-none">
        <div className={`absolute ${overlayLayout.mobileDpad} pointer-events-auto select-none`}>
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button
              type="button"
              className="retro-btn flex h-12 w-12 items-center justify-center"
              onPointerDown={() => handleMoveStart('up')}
              onPointerUp={() => handleMoveEnd('up')}
              onPointerCancel={() => handleMoveEnd('up')}
              onPointerLeave={() => handleMoveEnd('up')}
            >
              <ChevronUp size={18} />
            </button>
            <div />

            <button
              type="button"
              className="retro-btn flex h-12 w-12 items-center justify-center"
              onPointerDown={() => handleMoveStart('left')}
              onPointerUp={() => handleMoveEnd('left')}
              onPointerCancel={() => handleMoveEnd('left')}
              onPointerLeave={() => handleMoveEnd('left')}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-12 h-12" />
            <button
              type="button"
              className="retro-btn flex h-12 w-12 items-center justify-center"
              onPointerDown={() => handleMoveStart('right')}
              onPointerUp={() => handleMoveEnd('right')}
              onPointerCancel={() => handleMoveEnd('right')}
              onPointerLeave={() => handleMoveEnd('right')}
            >
              <ChevronRight size={18} />
            </button>

            <div />
            <button
              type="button"
              className="retro-btn flex h-12 w-12 items-center justify-center"
              onPointerDown={() => handleMoveStart('down')}
              onPointerUp={() => handleMoveEnd('down')}
              onPointerCancel={() => handleMoveEnd('down')}
              onPointerLeave={() => handleMoveEnd('down')}
            >
              <ChevronDown size={18} />
            </button>
            <div />
          </div>
        </div>

        <div className={`absolute ${overlayLayout.mobileInteract} pointer-events-auto`}>
          <button
            type="button"
            className="retro-btn retro-btn-accent pixel-font h-14 w-20 text-[9px] uppercase flex flex-col items-center justify-center gap-1"
            onClick={handleInteract}
          >
            <Zap size={14} />
            Interact
          </button>
        </div>
      </div>
    </>
  )
}