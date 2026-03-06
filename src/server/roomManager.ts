import { WebSocket } from 'ws'
import { randomUUID } from 'crypto'
import type { PlayerState, ServerMessage } from '@/types/ws-protocol'

export class RoomManager {
  private players = new Map<string, PlayerState>()
  private sockets = new Map<string, WebSocket>()

  generateId(): string {
    return randomUUID()
  }

  hasPlayer(socketId: string): boolean {
    return this.players.has(socketId)
  }

  join(socketId: string, ws: WebSocket, username: string): void {
    const player: PlayerState = {
      id: socketId,
      username: username.slice(0, 16),
      x: 16,
      y: 12,
      direction: 'down',
      isMoving: false,
    }

    this.players.set(socketId, player)
    this.sockets.set(socketId, ws)

    // Send room state to the new joiner
    const players = Array.from(this.players.values())
    this.send(ws, { type: 'ROOM_STATE', payload: { players, yourId: socketId } })

    // Broadcast new player to everyone else
    this.broadcast(socketId, { type: 'PLAYER_JOIN', payload: player })
  }

  move(
    socketId: string,
    pos: { x: number; y: number; direction: string; isMoving: boolean },
  ): void {
    const player = this.players.get(socketId)
    if (!player) return

    // Sanity check: max delta 3 tiles per update
    if (Math.abs(pos.x - player.x) > 3 || Math.abs(pos.y - player.y) > 3) return

    player.x = Math.max(0, Math.min(32, pos.x))
    player.y = Math.max(0, Math.min(23, pos.y))
    player.direction = pos.direction as PlayerState['direction']
    player.isMoving = pos.isMoving

    this.broadcastAll(
      {
        type: 'PLAYER_MOVE',
        payload: {
          id: socketId,
          x: player.x,
          y: player.y,
          direction: player.direction,
          isMoving: player.isMoving,
        },
      },
      socketId,
    )
  }

  broadcastChat(socketId: string, message: string): void {
    if (!this.players.has(socketId)) return
    const sanitized = message.slice(0, 100)
    this.broadcastAll({ type: 'CHAT', payload: { id: socketId, message: sanitized } })
  }

  leave(socketId: string): void {
    this.players.delete(socketId)
    this.sockets.delete(socketId)
    this.broadcastAll({ type: 'PLAYER_LEAVE', payload: { id: socketId } })
  }

  private send(ws: WebSocket, msg: ServerMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    }
  }

  private broadcast(excludeId: string, msg: ServerMessage): void {
    const data = JSON.stringify(msg)
    for (const [id, ws] of this.sockets) {
      if (id !== excludeId && ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    }
  }

  private broadcastAll(msg: ServerMessage, excludeId?: string): void {
    const data = JSON.stringify(msg)
    for (const [id, ws] of this.sockets) {
      if (id !== excludeId && ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    }
  }
}
