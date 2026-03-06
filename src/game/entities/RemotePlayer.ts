import Phaser from 'phaser'
import { TILE_SIZE, INTERPOLATION_BUFFER, MOVE_DURATION_MS } from '@/game/constants'
import type { PlayerState } from '@/types/ws-protocol'
import type { ChatBubbleManager } from '@/game/managers/ChatBubbleManager'

interface PositionSnapshot {
  x: number
  y: number
  direction: string
  isMoving: boolean
}

export class RemotePlayer {
  public sprite: Phaser.GameObjects.Sprite
  private nametag: Phaser.GameObjects.Text
  private scene: Phaser.Scene
  private positionBuffer: PositionSnapshot[] = []
  private isTweening = false
  public id: string

  constructor(scene: Phaser.Scene, state: PlayerState) {
    this.scene = scene
    this.id = state.id

    const px = state.x * TILE_SIZE + TILE_SIZE / 2
    const py = state.y * TILE_SIZE + TILE_SIZE / 2

    this.sprite = scene.add.sprite(px, py, 'player-remote')
    this.sprite.setTint(0x88aaff)
    this.sprite.setDepth(py)

    this.nametag = scene.add.text(px, py - 14, state.username, {
      fontSize: '7px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    })
    this.nametag.setOrigin(0.5, 0.5)
    this.nametag.setDepth(20)
  }

  enqueuePosition(pos: Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'>): void {
    if (this.positionBuffer.length >= 5) {
      this.positionBuffer.shift()
    }
    this.positionBuffer.push({
      x: pos.x,
      y: pos.y,
      direction: pos.direction,
      isMoving: pos.isMoving,
    })
  }

  update(_delta: number): void {
    this.sprite.setDepth(this.sprite.y)
    this.nametag.setPosition(this.sprite.x, this.sprite.y - 14)

    if (this.isTweening || this.positionBuffer.length < INTERPOLATION_BUFFER) return

    const next = this.positionBuffer.shift()!
    const targetPx = next.x * TILE_SIZE + TILE_SIZE / 2
    const targetPy = next.y * TILE_SIZE + TILE_SIZE / 2

    // Snap if too far away
    const dist = Math.abs(targetPx - this.sprite.x) + Math.abs(targetPy - this.sprite.y)
    if (dist > 5 * TILE_SIZE) {
      this.sprite.setPosition(targetPx, targetPy)
      return
    }

    this.isTweening = true
    this.scene.tweens.add({
      targets: this.sprite,
      x: targetPx,
      y: targetPy,
      duration: MOVE_DURATION_MS,
      ease: 'Linear',
      onComplete: () => {
        this.isTweening = false
      },
    })
  }

  showChat(message: string, chatBubbleManager: ChatBubbleManager): void {
    chatBubbleManager.show({ id: this.id, sprite: this.sprite, message })
  }

  destroy(): void {
    this.scene.tweens.killTweensOf(this.sprite)
    this.sprite.destroy()
    this.nametag.destroy()
  }
}
