/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { EventBus, GameEvents } from '@/game/EventBus'
import { Pause, StepBack, StepForward, Play, Headphones, HeadphoneOff } from 'lucide-react'

declare global {
  interface Window {
    SC?: any
  }
}

const SC_PLAYLIST_URL = 'https://soundcloud.com/lofi-hip-hop-music/sets/lofi-lofi'
const SC_EMBED_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SC_PLAYLIST_URL,
)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`

const TRACK_TITLE = 'LOFI BEATS'

export default function MusicPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const ignorePauseRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [trackName, setTrackName] = useState('')
  const [muted, setMuted] = useState(false)

  const playWithGuard = (widget: any, delay = 0) => {
    ignorePauseRef.current = true
    const doPlay = () => {
      widget.play()
      setTimeout(() => {
        ignorePauseRef.current = false
      }, 1000)
    }
    if (delay) setTimeout(doPlay, delay)
    else doPlay()
  }

  useEffect(() => {
    const scriptId = 'sc-widget-api'

    const initWidget = () => {
      const iframe = iframeRef.current
      if (!iframe || !window.SC) return

      const widget = window.SC.Widget(iframe)
      widgetRef.current = widget
      const Events = window.SC.Widget.Events

      widget.bind(Events.READY, () => {
        setIsReady(true)
        setIsPlaying(true)
        playWithGuard(widget)
      })

      widget.bind(Events.PLAY, () => {
        setIsPlaying(true)
        widget.getSounds((sounds: { title: string }[]) => {
          widget.getCurrentSoundIndex((idx: number) => {
            setTrackName(sounds[idx]?.title ?? TRACK_TITLE)
          })
        })
      })

      widget.bind(Events.PAUSE, () => {
        if (ignorePauseRef.current) return
        setIsPlaying(false)
      })

      widget.bind(Events.FINISH, () => {
        if (ignorePauseRef.current) return
        setIsPlaying(false)
      })
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://w.soundcloud.com/player/api.js'
      script.async = true
      script.onload = initWidget
      document.body.appendChild(script)
    } else if (window.SC) {
      initWidget()
    } else {
      const existing = document.getElementById(scriptId) as HTMLScriptElement
      existing.addEventListener('load', initWidget)
    }

    const onBackToTitle = () => {
      ignorePauseRef.current = false
      widgetRef.current?.pause()
      setIsPlaying(false)
    }

    EventBus.on(GameEvents.BACK_TO_TITLE, onBackToTitle)

    return () => {
      EventBus.off(GameEvents.BACK_TO_TITLE, onBackToTitle)
    }
  }, [])

  useEffect(() => {
    const widget = widgetRef.current
    if (!widget) return
    widget.setVolume(muted ? 0 : 100)
    EventBus.emit(GameEvents.MUSIC_MUTED_CHANGED, muted)
  }, [muted])

  useEffect(() => {
    const onToggleMute = () => setMuted((current) => !current)
    EventBus.on(GameEvents.MUSIC_TOGGLE_MUTE, onToggleMute)
    return () => {
      EventBus.off(GameEvents.MUSIC_TOGGLE_MUTE, onToggleMute)
    }
  }, [])

  const changeTrack = (step: number) => {
    const widget = widgetRef.current
    if (!widget || !isReady) return
    widget.getSounds((sounds: { title: string }[]) => {
      if (!sounds.length) return
      widget.getCurrentSoundIndex((current: number) => {
        const total = sounds.length
        const next = (current + step + total) % total
        widget.skip(next)
        setIsPlaying(true)
        playWithGuard(widget, 400)
      })
    })
  }

  const togglePlay = () => {
    const widget = widgetRef.current
    if (!widget || !isReady) return
    if (isPlaying) {
      ignorePauseRef.current = false
      widget.pause()
      return
    }
    playWithGuard(widget)
  }

  const baseButtonClass =
    'retro-btn retro-btn-flat flex h-6 w-6 items-center justify-center border-none p-0 text-[8px] leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-35'

  return (
    <>
      <div className='pointer-events-none absolute h-px w-px overflow-hidden opacity-0' aria-hidden>
        <iframe
          ref={iframeRef}
          src={SC_EMBED_URL}
          allow='autoplay'
          title='SoundCloud Player'
        />
      </div>

      <div className='pixel-font absolute top-3 left-1/2 z-[35] hidden -translate-x-1/2 select-none md:block'>
        <div className='retro-chip h-8 min-w-[320px] max-w-[240px] gap-1.5 px-1 text-[9px]'>
          <span
            className={`min-w-0 flex-1 truncate ${isPlaying ? 'text-[var(--nb-link)]' : 'text-[var(--nb-ink)]/70'}`}
            title={isReady ? `${trackName || TRACK_TITLE}` : 'Loading'}
          >
            {isReady ? `${isPlaying ? '>>' : '||'} ${trackName || TRACK_TITLE}` : '-- LOADING --'}
          </span>

          <button
            className={baseButtonClass}
            onClick={() => changeTrack(-1)}
            disabled={!isReady}
            title='Previous track'
          >
            <StepBack size={11} />
          </button>

          <button
            className={baseButtonClass}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            disabled={!isReady}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
          </button>

          <button
            className={baseButtonClass}
            onClick={() => changeTrack(1)}
            disabled={!isReady}
            title='Next track'
          >
            <StepForward size={11} />
          </button>

          <button
            className={baseButtonClass}
            onClick={() => setMuted((m) => !m)}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <HeadphoneOff size={11} /> : <Headphones size={11} />}
          </button>
        </div>
      </div>
    </>
  )
}