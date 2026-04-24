import Phaser from 'phaser'
import { TILE_SIZE, MOVE_DURATION_MS, charSheetKey } from '@/game/constants'
import type { PlayerState } from '@/types/ws-protocol'
import type { ChatBubbleManager } from '@/game/managers/ChatBubbleManager'

// How many ms to wait before consuming the buffer when it's been idle.
// This covers the case where a player stops moving and no more positions
// arrive — we still need to flush the last queued position.
const IDLE_FLUSH_DELAY_MS = MOVE_DURATION_MS * 1.5

interface PositionSnapshot {
  x: number
  y: number
  direction: string
  isMoving: boolean
}

export class RemotePlayer {
  public sprite: Phaser.GameObjects.Sprite
  private nametagId: string
  private scene: Phaser.Scene
  private positionBuffer: PositionSnapshot[] = []
  private isTweening = false
  private currentDirection = 'down'
  private sheetKey: string
  public id: string

  // Tracks how long we've been waiting with a non-empty buffer but not tweening.
  // When this exceeds IDLE_FLUSH_DELAY_MS we flush regardless of buffer size,
  // which prevents the last move from getting stuck.
  private idleWaitMs = 0

  constructor(scene: Phaser.Scene, state: PlayerState, chatBubbleManager?: ChatBubbleManager) {
    this.scene = scene
    this.id = state.id
    this.sheetKey = charSheetKey(state.character ?? 0)
    this.currentDirection = state.direction ?? 'down'

    const px = state.x * TILE_SIZE + TILE_SIZE / 2
    const py = state.y * TILE_SIZE + TILE_SIZE / 2

    this.sprite = scene.add.sprite(px, py, this.sheetKey, 0)
    this.sprite.play(`${this.sheetKey}-idle-${this.currentDirection}`)
    this.sprite.setDepth(py)

    if (chatBubbleManager) {
      this.nametagId = this.id
      chatBubbleManager.createNametag(this.nametagId, this.sprite, state.username)
    } else {
      const text = scene.add.text(px, py - 14, state.username, {
        fontSize: '7px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      text.setOrigin(0.5, 0.5)
      text.setDepth(20)
      this.nametagId = ''
    }
  }

  enqueuePosition(pos: Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'>): void {
    // Cap buffer to avoid runaway lag buildup
    if (this.positionBuffer.length >= 5) {
      this.positionBuffer.shift()
    }
    this.positionBuffer.push({
      x: pos.x,
      y: pos.y,
      direction: pos.direction,
      isMoving: pos.isMoving,
    })
    // Reset idle counter whenever new data arrives
    this.idleWaitMs = 0
  }

  update(delta: number): void {
    this.sprite.setDepth(this.sprite.y)

    // Nothing to do
    if (this.positionBuffer.length === 0) return

    // Already mid-tween — let it finish, next update will chain immediately
    if (this.isTweening) return

    // Wait for at least 1 buffered position.
    // If only 1 is queued and the player might still be moving, give it a
    // short window (IDLE_FLUSH_DELAY_MS) to see if more arrive.
    // If none arrive within that window we flush anyway so the last step lands.
    if (this.positionBuffer.length === 1) {
      this.idleWaitMs += delta
      if (this.idleWaitMs < IDLE_FLUSH_DELAY_MS) return
    }

    this.idleWaitMs = 0
    this.consumeNextPosition()
  }

  private consumeNextPosition(): void {
    const next = this.positionBuffer.shift()!
    const targetPx = next.x * TILE_SIZE + TILE_SIZE / 2
    const targetPy = next.y * TILE_SIZE + TILE_SIZE / 2

    this.currentDirection = next.direction || this.currentDirection

    // Snap if too far away (e.g. teleport or reconnect)
    const dist = Math.abs(targetPx - this.sprite.x) + Math.abs(targetPy - this.sprite.y)
    if (dist > 5 * TILE_SIZE) {
      this.sprite.setPosition(targetPx, targetPy)
      this.sprite.play(`${this.sheetKey}-idle-${this.currentDirection}`, true)
      return
    }

    // No actual movement — just update direction/animation without tweening
    if (dist === 0) {
      if (!next.isMoving) {
        this.sprite.play(`${this.sheetKey}-idle-${this.currentDirection}`, true)
      }
      return
    }

    this.isTweening = true
    this.sprite.play(`${this.sheetKey}-walk-${this.currentDirection}`, true)

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetPx,
      y: targetPy,
      duration: MOVE_DURATION_MS,
      ease: 'Linear',
      onComplete: () => {
        this.isTweening = false

        // If more moves are buffered, chain immediately — no idle flash
        if (this.positionBuffer.length > 0) {
          this.consumeNextPosition()
        } else {
          // Truly stopped — play idle
          this.sprite.play(`${this.sheetKey}-idle-${this.currentDirection}`, true)
        }
      },
    })
  }

  showChat(message: string, chatBubbleManager: ChatBubbleManager): void {
    chatBubbleManager.show({ id: this.id, sprite: this.sprite, message })
  }

  destroy(): void {
    this.scene.tweens.killTweensOf(this.sprite)
    this.sprite.destroy()
  }
}