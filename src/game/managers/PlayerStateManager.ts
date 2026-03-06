import type Phaser from 'phaser'
import type { ServerMessage, PlayerState } from '@/types/ws-protocol'
import { RemotePlayer } from '@/game/entities/RemotePlayer'
import type { ChatBubbleManager } from '@/game/managers/ChatBubbleManager'

export class PlayerStateManager {
  private scene: Phaser.Scene
  private players = new Map<string, RemotePlayer>()
  private localId: string | null = null
  private chatBubbleManager: ChatBubbleManager

  constructor(scene: Phaser.Scene, chatBubbleManager: ChatBubbleManager) {
    this.scene = scene
    this.chatBubbleManager = chatBubbleManager
  }

  setLocalId(id: string): void {
    this.localId = id
  }

  handleServerMessage(msg: ServerMessage): void {
    switch (msg.type) {
      case 'ROOM_STATE': {
        this.localId = msg.payload.yourId
        for (const p of msg.payload.players) {
          if (p.id !== this.localId) {
            this.addPlayer(p)
          }
        }
        break
      }
      case 'PLAYER_JOIN': {
        if (msg.payload.id !== this.localId) {
          this.addPlayer(msg.payload)
        }
        break
      }
      case 'PLAYER_MOVE': {
        const remote = this.players.get(msg.payload.id)
        if (remote) {
          remote.enqueuePosition(msg.payload)
        }
        break
      }
      case 'PLAYER_LEAVE': {
        this.removePlayer(msg.payload.id)
        break
      }
      case 'CHAT': {
        const remote = this.players.get(msg.payload.id)
        if (remote) {
          remote.showChat(msg.payload.message, this.chatBubbleManager)
        }
        break
      }
    }
  }

  private addPlayer(state: PlayerState): void {
    if (this.players.has(state.id)) return
    const remote = new RemotePlayer(this.scene, state)
    this.players.set(state.id, remote)
  }

  private removePlayer(id: string): void {
    const remote = this.players.get(id)
    if (remote) {
      remote.destroy()
      this.players.delete(id)
    }
  }

  update(delta: number): void {
    for (const remote of this.players.values()) {
      remote.update(delta)
    }
  }

  destroy(): void {
    for (const remote of this.players.values()) {
      remote.destroy()
    }
    this.players.clear()
  }
}
