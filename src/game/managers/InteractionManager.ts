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

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    this.hintBg = scene.add.graphics()
    this.hintBg.setDepth(40)
    this.hintBg.setVisible(false)

    this.hintText = scene.add.text(0, 0, '', {
      fontSize: '7px',
      color: '#ffffff',
    })
    this.hintText.setDepth(41)
    this.hintText.setVisible(false)
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

      if (Phaser.Input.Keyboard.JustDown(this.eKey) && found.type !== 'placeholder') {
        EventBus.emit(GameEvents.INTERACTION, { type: found.type })
      }
    } else {
      this.activeZone = null
      this.hideHint()
    }
  }

  private showHint(label: string, tileX: number, tileY: number): void {
    const px = tileX * TILE_SIZE + TILE_SIZE / 2
    const py = tileY * TILE_SIZE - 10

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
