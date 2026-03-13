import Phaser from 'phaser'
import { TILE_SIZE } from '@/game/constants'
import { INTERACTION_ZONES, type InteractionZone } from '@/game/map/interactionZones'
import { EventBus, GameEvents } from '@/game/EventBus'
import { LAYER_OVERHEAD } from '../scenes/GameScene'

const DIRECTION_OFFSETS: Record<string, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 1 },
}

export class InteractionManager {
  private scene: Phaser.Scene
  private eKey: Phaser.Input.Keyboard.Key
  private hintText: Phaser.GameObjects.Text
  private hintBg: Phaser.GameObjects.Graphics
  private activeZone: InteractionZone | null = null
  private mobileInteractJustPressed = false
  private hintTween: Phaser.Tweens.Tween | null = null
  private currentHintPosition: { x: number; y: number } = { x: 0, y: 0 }

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    this.hintBg = scene.add.graphics()
    this.hintBg.setDepth(LAYER_OVERHEAD + 10_000)
    this.hintBg.setVisible(false)
    this.hintBg.setAlpha(0)

    this.hintText = scene.add.text(0, 0, '', {
      fontSize: '10px',
      color: '#ffffff',
    })
    this.hintText.setDepth(LAYER_OVERHEAD + 10_001)
    this.hintText.setVisible(false)
    this.hintText.setAlpha(0)

    // Listen for mobile / on-screen interact button
    EventBus.on(GameEvents.MOBILE_INTERACT, () => {
      this.mobileInteractJustPressed = true
    })

    // Allow clicking/tapping directly on interactive objects/zones
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const worldX = pointer.worldX
      const worldY = pointer.worldY

      const tileX = Math.floor(worldX / TILE_SIZE)
      const tileY = Math.floor(worldY / TILE_SIZE)

      let clickedZone: InteractionZone | null = null
      for (const zone of INTERACTION_ZONES) {
        const inZone = zone.tiles!.some((t) => t.x === tileX && t.y === tileY)
        if (inZone) {
          clickedZone = zone
          break
        }
      }

      if (clickedZone && clickedZone.type !== 'placeholder') {
        EventBus.emit(GameEvents.INTERACTION, { type: clickedZone.type })
      } else {
        // No interaction zone — tap-to-move the player to that tile
        EventBus.emit(GameEvents.TOUCH_MOVE_TO, { tileX, tileY })
      }
    })
  }

  update(playerTileX: number, playerTileY: number, direction: string): void {
    const offset = DIRECTION_OFFSETS[direction] ?? { dx: 0, dy: 0 }
    const facingX = playerTileX + offset.dx
    const facingY = playerTileY + offset.dy

    let found: InteractionZone | null = null
    for (const zone of INTERACTION_ZONES) {
      const match = zone.tiles!.some(
        (t) =>
          (t.x === playerTileX && t.y === playerTileY) ||
          (t.x === facingX && t.y === facingY),
      )
      if (match) {
        found = zone
        break
      }
    }

    if (found) {
      // If this is a new zone or we're showing a hint for the first time
      if (this.activeZone !== found) {
        this.activeZone = found
        this.showHintWithAnimation(found.label, found.tiles!)
      }

      const interactPressed = Phaser.Input.Keyboard.JustDown(this.eKey) || this.mobileInteractJustPressed

      if (interactPressed && found.type !== 'placeholder') {
        EventBus.emit(GameEvents.INTERACTION, { type: found.type })
        
        // Optional: Add a quick feedback animation when interacting
        this.playInteractFeedback()
      }
    } else {
      if (this.activeZone !== null) {
        this.activeZone = null
        this.hideHintWithAnimation()
      }
    }

    // Cursor feedback: pointer when hovering any interactive zone (non-placeholder), default otherwise
    const canvas = this.scene.game.canvas
    if (this.activeZone && this.activeZone.type !== 'placeholder') {
      canvas.style.cursor = 'pointer'
    } else {
      canvas.style.cursor = 'default'
    }

    // Reset mobile "just pressed" flag each frame
    this.mobileInteractJustPressed = false
  }

  private calculateZoneCenter(tiles: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (tiles.length === 0) return { x: 0, y: 0 }
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    for (const tile of tiles) {
      minX = Math.min(minX, tile.x)
      minY = Math.min(minY, tile.y)
      maxX = Math.max(maxX, tile.x)
      maxY = Math.max(maxY, tile.y)
    }
    
    // Calculate center tile coordinates (can be fractional if rectangle has even dimensions)
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    
    return { x: centerX, y: centerY }
  }

  private showHintWithAnimation(label: string, tiles: Array<{ x: number; y: number }>): void {
    // Kill any existing animation
    if (this.hintTween) {
      this.hintTween.stop()
      this.hintTween = null
    }

    const center = this.calculateZoneCenter(tiles)
    
    // Convert to world pixel coordinates
    const px = center.x * TILE_SIZE + TILE_SIZE / 2
    const py = center.y * TILE_SIZE - 18 // Position above the zone

    // Set initial position and text
    this.hintText.setText(label)
    this.hintText.setPosition(px - this.hintText.width / 2, py - this.hintText.height / 2)
    
    // Start invisible
    this.hintText.setAlpha(0)
    this.hintText.setVisible(true)
    this.hintBg.setAlpha(0)
    this.hintBg.setVisible(true)

    // Redraw background at the new position
    this.hintBg.clear()
    this.hintBg.fillStyle(0x000000, 0.7)
    this.hintBg.fillRoundedRect(
      this.hintText.x - 3,
      this.hintText.y - 2,
      this.hintText.width + 6,
      this.hintText.height + 4,
      2,
    )

    // Pokemon-style "pop in" animation
    this.scene.tweens.add({
      targets: [this.hintText, this.hintBg],
      alpha: 1,
      duration: 120,
      ease: 'Linear',
      onComplete: () => {
        // Add a subtle bounce/shimmer after appearing
        this.scene.tweens.add({
          targets: this.hintText,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          yoyo: true,
          repeat: 1,
          ease: 'Linear',
          onComplete: () => {
            this.hintText.setScale(1)
            this.hintBg.clear()
            this.hintBg.fillStyle(0x000000, 0.7)
            this.hintBg.fillRoundedRect(
              this.hintText.x - 3,
              this.hintText.y - 2,
              this.hintText.width + 6,
              this.hintText.height + 4,
              2,
            )
          }
        })
      }
    })
  }

  private hideHintWithAnimation(): void {
    if (this.hintTween) {
      this.hintTween.stop()
      this.hintTween = null
    }

    // Quick fade out (Pokemon style - instant but with a tiny fade)
    this.scene.tweens.add({
      targets: [this.hintText, this.hintBg],
      alpha: 0,
      duration: 80,
      ease: 'Linear',
      onComplete: () => {
        this.hintText.setVisible(false)
        this.hintBg.setVisible(false)
      }
    })
  }

  private playInteractFeedback(): void {
    // Optional: Quick pulse animation when interacting
    this.scene.tweens.add({
      targets: [this.hintText, this.hintBg],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 150,
      yoyo: true,
      ease: 'Sine.easeInOut'
    })
  }

  destroy(): void {
    if (this.hintTween) {
      this.hintTween.stop()
    }
    this.hintText.destroy()
    this.hintBg.destroy()
  }
}