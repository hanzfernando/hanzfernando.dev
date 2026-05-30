'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import pokemon from '@/data/pokemon.json'
import { useGameStore } from '@/store/gameStore'

interface GrassEncounterPanelProps {
  onClose: () => void
}

type PokemonEntry = (typeof pokemon)[number]

// ============================================
// ENCOUNTER SPRITE COMPONENT with fallback handling
// ============================================
function EncounterSprite({ encounter, useShiny }: { encounter: PokemonEntry; useShiny: boolean }) {
  const [useFallback, setUseFallback] = useState(false)
  const animatedUrl = encounter.spriteUrlAnimated?.trim() ? encounter.spriteUrlAnimated : null
  const shinyAnimatedUrl = useShiny && animatedUrl
    ? animatedUrl.replace('/sprites/ani/', '/sprites/ani-shiny/')
    : null
  const preferredSpriteUrl = shinyAnimatedUrl ?? animatedUrl ?? encounter.spriteUrl
  const fallbackSpriteUrl = encounter.spriteUrl
  const spriteUrl = useFallback ? fallbackSpriteUrl : preferredSpriteUrl

  if (!spriteUrl) return null

  return (
    <Image
      src={spriteUrl}
      alt={`${encounter.name} appeared from the grass`}
      width={120}
      height={120}
      unoptimized
      className="wild-encounter-sprite h-40 w-auto"
      onError={() => {
        if (!useFallback && fallbackSpriteUrl && spriteUrl !== fallbackSpriteUrl) {
          setUseFallback(true)
        }
      }}
    />
  )
}

// ============================================
// MAIN ENCOUNTER PANEL with CALM FLICKER + SPLIT
// ============================================
export default function GrassEncounterPanel({ onClose }: GrassEncounterPanelProps) {
  const encounterIndex = useGameStore((state) => state.grassEncounterIndex)
  const username = useGameStore((state) => state.username)
  const encounter = pokemon.length > 0 ? pokemon[encounterIndex % pokemon.length] : null
  
  const [showChoice, setShowChoice] = useState(false)
  const [showFlicker, setShowFlicker] = useState(true)
  const [showSplitTop, setShowSplitTop] = useState(true)
  const [showSplitBottom, setShowSplitBottom] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const [dialogVisible, setDialogVisible] = useState(false)

  // Animation sequence: calm flicker (650ms) → split (500ms) → dialog
  useEffect(() => {
    // Flicker lasts ~650ms, then hide the overlay
    const flickerTimer = setTimeout(() => {
      setShowFlicker(false)
    }, 680)

    // Split starts at 400ms (from CSS), wait for it to complete
    const splitTimer = setTimeout(() => {
      setShowSplitTop(false)
      setShowSplitBottom(false)
    }, 950) // 400ms delay + 500ms animation = 900ms, add buffer

    // Show dialog after split is done
    const dialogTimer = setTimeout(() => {
      setDialogVisible(true)
      setIsAnimating(false)
    }, 1000)

    return () => {
      clearTimeout(flickerTimer)
      clearTimeout(splitTimer)
      clearTimeout(dialogTimer)
    }
  }, [])

  // Handle click to show choice menu
  const handleContainerClick = () => {
    // Only show choices after dialog is visible and not already showing choices
    if (dialogVisible && !showChoice) {
      setShowChoice(true)
    }
  }

  // Handle run button click
  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  if (!encounter) return null
  const useShiny = username.trim().toLowerCase() === 'hanz'

  return (
    <>
      {/* CALM FLICKER OVERLAY - like original Pokémon */}
      {showFlicker && <div className="wild-flicker-overlay" />}

      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05070b]/80 px-3"
        role="dialog"
        aria-modal="true"
        aria-label="Wild grass encounter"
        onClick={handleContainerClick}
      >
        <div className="wild-encounter-shell float-fade-in relative w-full max-w-2xl bg-white wild-encounter-container">
          {/* SPLIT OVERLAYS - classic black screen split */}
          {showSplitTop && <div className="wild-split-overlay-top" />}
          {showSplitBottom && <div className="wild-split-overlay-bottom" />}

          <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden p-5">
            {/* POKEMON SPRITE */}
            {encounter && (
              <EncounterSprite
                key={encounter.id ?? encounter.name}
                encounter={encounter}
                useShiny={useShiny}
              />
            )}

            {/* DIALOG - appears after split animation finishes */}
            {dialogVisible && !showChoice && (
              <div className="wild-encounter-dialog pixel-font absolute inset-x-3 bottom-3 px-3 py-3 text-left text-[9px] uppercase leading-relaxed md:text-[10px]">
                <p>A wild {encounter?.name ?? 'Pokémon'} has appeared!</p>
                <span className="wild-dialog-caret absolute bottom-2 right-3" aria-hidden="true">
                  ▼
                </span>
              </div>
            )}

            {/* CHOICE MENU - appears after clicking the dialog */}
            {showChoice && (
              <div className="wild-encounter-choice pixel-font absolute bottom-3 right-3 min-w-32 p-2 text-[10px] uppercase">
                <button
                  type="button"
                  onClick={handleRun}
                  className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-[#f3dfaa] transition-colors"
                >
                  <span aria-hidden="true">▶</span>
                  Run
                </button>
                {/* You can add more options like "Fight", "Bag", "Pokémon" here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}