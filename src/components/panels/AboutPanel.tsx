'use client'
import PanelBase from '@/components/panels/PanelBase'
import { skillCategories } from '@/data/skills'
import { EventBus, GameEvents } from '@/game/EventBus'
import { useGameStore } from '@/store/gameStore'

interface AboutPanelProps {
  onClose: () => void
}

// Each category gets an accent that works on top of --nb-paper
const categoryStyle: Record<string, { chipBg: string; chipText: string }> = {
  Frontend:             { chipBg: '#f0c34f', chipText: '#2f2510' },
  Backend:              { chipBg: '#d14545', chipText: '#fff'    },
  Databases:            { chipBg: '#2a9865', chipText: '#fff'    },
  Languages:            { chipBg: '#245084', chipText: '#fff'    },
  'Tools & Testing':    { chipBg: '#b98817', chipText: '#fff'    },
  'Cloud & Deployment': { chipBg: '#173257', chipText: '#fff'    },
  Design:               { chipBg: '#5f8fc1', chipText: '#fff'    },
}

export default function AboutPanel({ onClose }: AboutPanelProps) {
  const openPanel = useGameStore((s) => s.openPanel)

  function handleProjectsClick() {
    EventBus.emit(GameEvents.TELEPORT_TO, { tileX: 27, tileY: 10 })
    ;(async () => {
      await new Promise((res) => setTimeout(res, 1400))
      openPanel('projects')
    })()
  }

  return (
    <PanelBase title="About Me" onClose={onClose}>
      <div className="space-y-3 text-[12px] leading-relaxed md:text-[13px]">

        {/* ── Identity ─────────────────────────────────────────────── */}
        <div
          className="retro-card relative overflow-hidden"
          style={{ padding: '10px 12px' }}
        >
          <div className='pl-3'>
            <div className='flex items-center flex-wrap gap-2'>
              <span
                className="pixel-font"
                style={{ fontSize: 13, color: 'var(--nb-ink)', letterSpacing: '-0.01em', lineHeight: 1.2 }}
              >
                Hanz Fernando
              </span>
              <span
                className="retro-chip pixel-font text-[8px] px-2 py-1"
              >
                Full-Stack Dev
              </span>
            </div>
            <p className='mt-4 text-(var(--nb-ink) 0.8) font-mono text-xs leading-relaxed'>
              👾 I build web apps with modern tools and a love for clean code.
              Based in the Philippines — shipping things that look good &amp; actually work.
            </p>
          </div>
        </div>

        {/* ── Status pills ─────────────────────────────────────────── */}
        <div className='flex gap-2 w-full'>
          {[
            { icon: '🟢', label: 'Open to Work' },
            { icon: '⚡', label: 'Fast Learner' },
            { icon: '🎮', label: 'Pixel Art Fan' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="retro-card flex items-center gap-2 py-2 px-3 text-sm text-(var(--nb-ink) 0.9) font-bold justify-center shadow-(3 3 var(--nb-shadow-hard)) w-full"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Skills ───────────────────────────────────────────────── */}
        <div className="retro-card p-4">
          {/* Section header */}
          <div
            className='flex items-center gap-2 mb-4 pb-2 border-b-2'
          >
            <span
              className="pixel-font text-[10px] text-(var(--nb-ink) 0.9) tracking-widest uppercase"
            >
              ⚡ Tech Stack
            </span>
            <span
              className='ml-auto text-[9px] font-mono font-bold text-(--nb-accent-dark)'
            >
              {skillCategories.reduce((n, c) => n + c.techs.length, 0)} techs
            </span>
          </div>

          <div className='flex flex-col gap-2'>
            {skillCategories.map(({ label, techs }) => {
              const s = categoryStyle[label] ?? { chipBg: '#e5e7eb', chipText: '#111' }
              return (
                <div key={label} className='flex items-center gap-2'>
                  {/* Category label */}
                  <span
                    style={{
                      background: s.chipBg,
                      color: s.chipText,
                      border: '2px solid var(--nb-stroke)',
                      minWidth: '7rem',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                    className="pixel-font inline-flex items-center justify-center text-[8px] py-1 px-2 uppercase tracking-[0.06em] leading-4"
                  >
                    {label}
                  </span>

                  {/* Tech pills */}
                  <div className='flex items-center flex-wrap gap-1'>
                    {techs.map(({ name, icon: Icon, color }) => (
                    <span
                      key={name}
                      style={{
                        border: '1.5px solid var(--nb-stroke)',
                        background: 'linear-gradient(180deg,#fffdf3,#f5ebcc)',
                        color: 'var(--nb-ink)',
                        boxShadow: '1px 1px 0 var(--nb-shadow-hard)',
                      }}
                      className="inline-flex items-center gap-1 font-mono text-[10px] font-bold py-1 px-2 leading-4"
                    >
                      <Icon size={11} style={{ color }} aria-hidden />
                      {name}
                    </span>
                  ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <button
          style={{
            boxShadow: '4px 4px 0 var(--nb-shadow-hard)',
          }}
          className="retro-btn retro-btn-accent pixel-font py-2 flex items-center justify-center w-full gap-4 text-[10px] uppercase tracking-widest"

          onClick={() => {
            onClose()
            handleProjectsClick()
          }}
        >
          <span>🔬</span>
          <span>See My Projects In The Lab</span>
          <span style={{ opacity: 0.6 }}>→</span>
        </button>

      </div>
    </PanelBase>
  )
}