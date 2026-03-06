import { EMIT_INTERVAL_MS } from '@/game/constants'
import type { WebSocketManager } from '@/game/managers/WebSocketManager'

interface Position {
  x: number
  y: number
  direction: string
  isMoving: boolean
}

export class MovementThrottle {
  private ws: WebSocketManager
  private lastEmit = 0
  private lastSent: Position | null = null
  private pending: Position | null = null

  constructor(ws: WebSocketManager) {
    this.ws = ws
  }

  push(position: Position): void {
    this.pending = position
  }

  tick(): void {
    if (!this.pending) return

    const now = performance.now()
    if (now - this.lastEmit < EMIT_INTERVAL_MS) return

    // Deduplication: skip if nothing changed
    if (
      this.lastSent &&
      this.lastSent.x === this.pending.x &&
      this.lastSent.y === this.pending.y &&
      this.lastSent.direction === this.pending.direction &&
      this.lastSent.isMoving === this.pending.isMoving
    ) {
      return
    }

    this.ws.send({
      type: 'PLAYER_MOVE',
      payload: {
        x: this.pending.x,
        y: this.pending.y,
        direction: this.pending.direction as 'up' | 'down' | 'left' | 'right',
        isMoving: this.pending.isMoving,
      },
    })

    this.lastSent = { ...this.pending }
    this.lastEmit = now
    this.pending = null
  }
}
