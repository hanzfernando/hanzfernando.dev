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
  }, [muted])

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        /*
          Gen 3 / Gen 4 — muted, neutral palette
          Inspired by: Route 119 rain, Dewford Cave, Mt. Coronet,
          Rustboro stone, the GBA/DS system UI, Canalave City dusk.

          --slate:      #8ab0c8  (Dewford ocean / Canalave dusk)
          --moss:       #8ab88a  (Route 119 grass / foggy routes)
          --amber:      #c8a858  (Trainer Card gold / item icons)
          --stone:      #b0a898  (Rustboro city stone)
          --panel-dark: #2a3040  (cave / night bg)
          --panel-mid:  #3a4458  (mid-dark panel)
          --panel-bg:   #2e3848  (controls bg)
          --text-dim:   #6a7a8a  (dim label)
          --text-lit:   #a0c0d8  (active label)
        */

        .mp-root {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 35;
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          user-select: none;
          width: 320px;
        }

        .mp-frame {
          background: #2a3040;
          box-shadow:
            0 0 0 2px #5a7a98,
            4px 4px 0 2px #1a2030,
            inset 0 0 0 1px #3a4a5a;
        }

        /* Title bar — Canalave/Dewford slate blue */
        .mp-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 8px;
          background: #3a5068;
          border-bottom: 2px solid #2a3a4a;
        }

        .mp-titlebar-left {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .mp-dot-row { display: flex; gap: 4px; }
        .mp-tdot { width: 6px; height: 6px; }
        /* desaturated, earthy traffic dots */
        .mp-tdot-r { background: #c87860; box-shadow: 0 0 0 1px #8a4a38; }
        .mp-tdot-y { background: #c8a858; box-shadow: 0 0 0 1px #8a7030; }
        .mp-tdot-g { background: #7aaa7a; box-shadow: 0 0 0 1px #486848; }

        .mp-title-text { color: #a8c0d0; font-size: 6px; letter-spacing: 0.1em; }

        .mp-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 6px;
          color: #7a9ab0;
        }
        .mp-status-dot {
          width: 5px; height: 5px;
          background: #5a7a98;
          opacity: 0.3;
        }
        /* ready → mossy green; playing → amber gold */
        .mp-status-dot.ready   {
          opacity: 1;
          background: #7aaa7a;
          animation: mp-blink 2s step-start infinite;
        }
        .mp-status-dot.playing {
          opacity: 1;
          background: #c8a858;
          animation: mp-blink 0.6s step-start infinite;
        }

        @keyframes mp-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }

        .mp-iframe-hidden {
          position: absolute;
          width: 1px; height: 1px;
          opacity: 0; pointer-events: none;
          overflow: hidden;
        }

        /* Controls bar — deep cave panel */
        .mp-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px 6px;
          background: #222838;
        }

        /* EQ bars — slate / moss / amber tricolor when playing */
        .mp-eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 12px;
          flex-shrink: 0;
        }
        .mp-eq-bar {
          width: 3px;
          background: #3a4a5a;
          height: 2px;
        }
        .mp-eq.playing .mp-eq-bar:nth-child(1) {
          background: #8ab0c8;
          animation: eq1 0.6s steps(4) infinite;
        }
        .mp-eq.playing .mp-eq-bar:nth-child(2) {
          background: #c8a858;
          animation: eq2 0.5s steps(4) infinite;
        }
        .mp-eq.playing .mp-eq-bar:nth-child(3) {
          background: #7aaa7a;
          animation: eq3 0.7s steps(4) infinite;
        }

        @keyframes eq1 { 0%{height:4px} 25%{height:10px} 50%{height:6px} 75%{height:12px} 100%{height:4px} }
        @keyframes eq2 { 0%{height:10px} 25%{height:4px} 50%{height:12px} 75%{height:6px} 100%{height:10px} }
        @keyframes eq3 { 0%{height:6px} 25%{height:12px} 50%{height:4px} 75%{height:8px} 100%{height:6px} }

        .mp-divider { width: 1px; height: 10px; background: #3a4a5a; flex-shrink: 0; }

        .mp-ctrl-label {
          color: #4a6070;
          font-size: 6px;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mp-ctrl-label.active { color: #8ab0c8; }

        /* Base button — dark stone */
        .mp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px 6px;
          background: #2e3c4e;
          color: #7a9ab0;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 6px;
          letter-spacing: 0.05em;
          line-height: 1;
          white-space: nowrap;
          box-shadow: 2px 2px 0 #141e28, inset 1px 1px 0 #3e5060;
        }
        .mp-btn:hover  { background: #384858; }
        .mp-btn:active { box-shadow: 1px 1px 0 #141e28; transform: translate(1px,1px); }
        .mp-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Skip — Dewford slate blue */
        .mp-btn-skip {
          background: #284058;
          color: #8ab0c8;
          box-shadow: 2px 2px 0 #102030, inset 1px 1px 0 #3a5870;
        }
        .mp-btn-skip:hover { background: #304a68; }
        .mp-btn-skip:active { box-shadow: 1px 1px 0 #102030; transform: translate(1px,1px); }

        /* Play/Pause — Trainer Card amber gold */
        .mp-btn-play {
          background: #3a3018;
          color: #c8a858;
          box-shadow: 2px 2px 0 #1a1808, inset 1px 1px 0 #504020;
        }
        .mp-btn-play:hover { background: #483a20; }
        .mp-btn-play:active { box-shadow: 1px 1px 0 #1a1808; transform: translate(1px,1px); }

        /* Mute — Route 119 moss green / muted = dim red */
        .mp-btn-mute {
          background: #203028;
          color: #7aaa7a;
          box-shadow: 2px 2px 0 #101810, inset 1px 1px 0 #2e4838;
        }
        .mp-btn-mute:hover { background: #283c30; }
        .mp-btn-mute:active { box-shadow: 1px 1px 0 #101810; transform: translate(1px,1px); }
        .mp-btn-mute.muted {
          color: #c87860;
          background: #302020;
          box-shadow: 2px 2px 0 #180e0e, inset 1px 1px 0 #482a28;
        }
        .mp-btn-mute.muted:hover { background: #3c2828; }
      `}</style>

      <div className="mp-iframe-hidden" aria-hidden>
        <iframe
          ref={iframeRef}
          src={SC_EMBED_URL}
          allow="autoplay"
          title="SoundCloud Player"
        />
      </div>

      <div className="mp-root">
        <div className="mp-frame">

          <div className="mp-titlebar">
            <div className="mp-titlebar-left">
              <div className="mp-dot-row">
                <div className="mp-tdot mp-tdot-r" />
                <div className="mp-tdot mp-tdot-y" />
                <div className="mp-tdot mp-tdot-g" />
              </div>
              <span className="mp-title-text">{TRACK_TITLE}</span>
            </div>
            <div className="mp-status">
              <div className={`mp-status-dot ${isReady ? (isPlaying ? 'playing' : 'ready') : ''}`} />
              <span>{isPlaying ? 'PLAYING' : isReady ? 'READY' : 'LOADING'}</span>
            </div>
          </div>

          <div className="mp-controls">
            <div className={`mp-eq ${isPlaying ? 'playing' : ''}`} aria-hidden>
              <div className="mp-eq-bar" />
              <div className="mp-eq-bar" />
              <div className="mp-eq-bar" />
            </div>

            <div className="mp-divider" />

            <span className={`mp-ctrl-label ${isPlaying ? 'active' : ''}`}>
              {isReady ? `${isPlaying ? '>>' : '||'} ${trackName || TRACK_TITLE}` : '-- LOADING --'}
            </span>

            <button className="mp-btn mp-btn-skip" onClick={() => changeTrack(-1)} disabled={!isReady}>
              <StepBack size={10} />
            </button>

            <button
              className="mp-btn mp-btn-play"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              disabled={!isReady}
            >
              {isPlaying ? <Pause size={10}/> : <Play size={10}/>}
            </button>

            <button className="mp-btn mp-btn-skip" onClick={() => changeTrack(1)} disabled={!isReady}>
              <StepForward size={10}/>
            </button>

            <button
              className={`mp-btn mp-btn-mute ${muted ? 'muted' : ''}`}
              onClick={() => setMuted(m => !m)}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <HeadphoneOff size={10} /> : <Headphones size={10} /> }
            </button>

          </div>
        </div>
      </div>
    </>
  )
}