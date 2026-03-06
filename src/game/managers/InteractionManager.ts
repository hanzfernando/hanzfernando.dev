import Phaser from 'phaser'
import { TILE_SIZE } from '@/game/constants'
import { INTERACTION_ZONES, type InteractionZone } from '@/game/map/interactionZones'
import { EventBus, GameEvents } from '@/game/EventBus'

const DIRECTION_OFFSETS: Record<string, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export class InteractionManager {
  private scene: Phaser.Scene
  private eKey: Phaser.Input.Keyboard.Key
  private hintText: Phaser.GameObjects.Text
  private hintBg: Phaser.GameObjects.Graphics
  private activeZone: InteractionZone | null = null
  private mobileInteractJustPressed = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    this.hintBg = scene.add.graphics()
    this.hintBg.setDepth(40)
    this.hintBg.setVisible(false)

    this.hintText = scene.add.text(0, 0, '', {
      fontSize: '10px',
      color: '#ffffff',
    })
    this.hintText.setDepth(41)
    this.hintText.setVisible(false)

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
        const inZone = zone.tiles.some((t) => t.x === tileX && t.y === tileY)
        if (inZone) {
          clickedZone = zone
          break
        }
      }

      if (clickedZone && clickedZone.type !== 'placeholder') {
        EventBus.emit(GameEvents.INTERACTION, { type: clickedZone.type })
      }
    })
  }

  update(playerTileX: number, playerTileY: number, direction: string): void {
    const offset = DIRECTION_OFFSETS[direction] ?? { dx: 0, dy: 0 }
    const facingX = playerTileX + offset.dx
    const facingY = playerTileY + offset.dy

    let found: InteractionZone | null = null
    for (const zone of INTERACTION_ZONES) {
      const match = zone.tiles.some(
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
      this.activeZone = found
      this.showHint(found.label, playerTileX, playerTileY)

      const interactPressed = Phaser.Input.Keyboard.JustDown(this.eKey) || this.mobileInteractJustPressed

      if (interactPressed && found.type !== 'placeholder') {
        EventBus.emit(GameEvents.INTERACTION, { type: found.type })
      }
    } else {
      this.activeZone = null
      this.hideHint()
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

  private showHint(label: string, tileX: number, tileY: number): void {
    const px = tileX * TILE_SIZE + TILE_SIZE / 2
    const py = tileY * TILE_SIZE - 18

    this.hintText.setText(label)
    this.hintText.setPosition(px - this.hintText.width / 2, py - this.hintText.height / 2)
    this.hintText.setVisible(true)

    this.hintBg.clear()
    this.hintBg.fillStyle(0x000000, 0.7)
    this.hintBg.fillRoundedRect(
      this.hintText.x - 3,
      this.hintText.y - 2,
      this.hintText.width + 6,
      this.hintText.height + 4,
      2,
    )
    this.hintBg.setVisible(true)
  }

  private hideHint(): void {
    this.hintText.setVisible(false)
    this.hintBg.setVisible(false)
  }

  destroy(): void {
    this.hintText.destroy()
    this.hintBg.destroy()
  }
}
