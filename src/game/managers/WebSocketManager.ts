import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import type { ClientMessage, PlayerState, ServerMessage } from '@/types/ws-protocol'
import { SPAWN_TILE_X, SPAWN_TILE_Y } from '../constants'

type MessageHandler = (msg: ServerMessage) => void
type OpenHandler = () => void
type TransportMode = 'supabase' | 'endpoint'

// Transport toggle: comment/uncomment the line you want to use.
const WS_TRANSPORT_MODE: TransportMode = 'supabase'
// const WS_TRANSPORT_MODE: TransportMode = 'endpoint'

type PresenceState = {
  id: string
  username: string
  character: number
  x: number
  y: number
  direction: PlayerState['direction']
  isMoving: boolean
  onlineAt: string
}

export class WebSocketManager {
  private transportMode: TransportMode = WS_TRANSPORT_MODE
  private hasFailedOverToEndpoint = false
  private offlineMode = false
  private ws: WebSocket | null = null
  private endpointUrl = ''
  private supabase: SupabaseClient | null = null
  private channel: RealtimeChannel | null = null
  private onMessage: MessageHandler | null = null
  private onOpen: OpenHandler | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private messageQueue: ClientMessage[] = []
  private isSubscribed = false
  private readonly localId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `p-${Date.now()}`
  private joined = false
  private username = 'Player'
  private character = 0
  private x = SPAWN_TILE_X
  private y = SPAWN_TILE_Y
  private direction: PlayerState['direction'] = 'down'
  private isMoving = false

  constructor() {
    if (typeof window === 'undefined') return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    this.endpointUrl = process.env.NEXT_PUBLIC_WS_URL ?? `${protocol}//${window.location.host}/api/ws`

    if (this.transportMode !== 'supabase') return

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabasePublishableKey) {
      console.error(
        'Missing Supabase env vars. Falling back to endpoint mode. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to use Supabase mode.',
      )
      this.transportMode = 'endpoint'
      return
    }

    this.supabase = createClient(supabaseUrl, supabasePublishableKey, {
      realtime: { params: { eventsPerSecond: 20 } },
    })
  }

  async connect(onMessage: MessageHandler, onOpen?: OpenHandler): Promise<void> {
    this.onMessage = onMessage
    this.onOpen = onOpen ?? null

    if (this.offlineMode) {
      this.onOpen?.()
      this.flushQueue()
      return
    }

    if (this.transportMode === 'supabase') {
      this.createChannel()
      return
    }

    try {
      await fetch('/api/socket')
    } catch {
      // Server might already be initialized.
    }
    this.createEndpointConnection()
  }

  private fallbackToEndpoint(): void {
    if (this.offlineMode) return
    if (this.transportMode === 'endpoint') return
    if (this.hasFailedOverToEndpoint) return

    this.hasFailedOverToEndpoint = true
    this.transportMode = 'endpoint'
    this.isSubscribed = false

    if (this.channel) {
      void this.channel.unsubscribe()
      this.channel = null
    }

    try {
      void fetch('/api/socket')
    } catch {
      // Best-effort bootstrap; endpoint connect may still succeed.
    }

    this.reconnectAttempts = 0
    this.createEndpointConnection()
  }

  private enterOfflineMode(): void {
    if (this.offlineMode) return

    this.offlineMode = true
    this.isSubscribed = false
    this.transportMode = 'endpoint'

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.channel) {
      void this.channel.unsubscribe()
      this.channel = null
    }

    this.onOpen?.()
    this.flushQueue()
  }

  private createEndpointConnection(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.endpointUrl)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.flushQueue()
      this.onOpen?.()
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as ServerMessage
        this.onMessage?.(msg)
      } catch {
        // Ignore malformed messages.
      }
    }

    this.ws.onclose = () => {
      this.scheduleReconnect()
    }

    this.ws.onerror = () => {
      // onclose is expected to run after onerror.
    }
  }

  private createChannel(): void {
    if (!this.supabase || this.channel) return

    this.channel = this.supabase.channel('game-room', {
      config: {
        broadcast: { self: false },
        presence: { key: this.localId },
      },
    })

    this.channel
      .on('broadcast', { event: 'player-move' }, ({ payload }) => {
        const p = payload as Partial<PlayerState> & { id?: string }
        if (!p.id || p.id === this.localId) return
        if (typeof p.x !== 'number' || typeof p.y !== 'number') return
        if (!this.isDirection(p.direction) || typeof p.isMoving !== 'boolean') return

        this.onMessage?.({
          type: 'PLAYER_MOVE',
          payload: {
            id: p.id,
            x: p.x,
            y: p.y,
            direction: p.direction,
            isMoving: p.isMoving,
          },
        })
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        const p = payload as { id?: string; message?: string }
        if (!p.id || typeof p.message !== 'string') return

        this.onMessage?.({
          type: 'CHAT',
          payload: { id: p.id, message: p.message.slice(0, 100) },
        })
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        for (const rawEntry of newPresences) {
          const entry = this.toPresenceState(rawEntry)
          if (!entry) continue
          if (!entry.id || entry.id === this.localId) continue

          this.onMessage?.({
            type: 'PLAYER_JOIN',
            payload: {
              id: entry.id,
              username: entry.username,
              character: entry.character,
              x: entry.x,
              y: entry.y,
              direction: entry.direction,
              isMoving: entry.isMoving,
            },
          })
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        for (const rawEntry of leftPresences) {
          const entry = this.toPresenceState(rawEntry)
          if (!entry) continue
          if (!entry.id || entry.id === this.localId) continue
          this.onMessage?.({ type: 'PLAYER_LEAVE', payload: { id: entry.id } })
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel?.presenceState<PresenceState>() ?? {}
        const players: PlayerState[] = []
        for (const presences of Object.values(state)) {
          const entry = presences[0]
          if (!entry || !entry.id || !this.isDirection(entry.direction)) continue
          players.push({
            id: entry.id,
            username: entry.username,
            character: entry.character,
            x: entry.x,
            y: entry.y,
            direction: entry.direction,
            isMoving: entry.isMoving,
          })
        }
        this.onMessage?.({
          type: 'ROOM_STATE',
          payload: { players, yourId: this.localId },
        })
      })

    this.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        this.isSubscribed = true
        this.reconnectAttempts = 0
        this.hasFailedOverToEndpoint = false
        if (this.joined) {
          this.updatePresence()
        }
        this.flushQueue()
        this.onOpen?.()
        return
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        this.isSubscribed = false
        this.fallbackToEndpoint()
        if (this.transportMode === 'endpoint') return
        this.scheduleReconnect()
      }
    })
  }

  send(msg: ClientMessage): void {
    if (this.isConnected()) {
      this.publishMessage(msg)
    } else {
      // Queue messages sent before connection opens
      // Keep only the latest PLAYER_MOVE to avoid stale position flood
      if (msg.type === 'PLAYER_MOVE') {
        const idx = this.messageQueue.findLastIndex((queued) => queued.type === 'PLAYER_MOVE')
        if (idx !== -1) this.messageQueue.splice(idx, 1)
      }
      this.messageQueue.push(msg)
    }
  }

  private isConnected(): boolean {
    if (this.offlineMode) return true

    if (this.transportMode === 'supabase') {
      return this.isSubscribed && !!this.channel
    }

    return this.ws?.readyState === WebSocket.OPEN
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()
      if (msg) this.publishMessage(msg)
    }
  }

  private publishMessage(msg: ClientMessage): void {
    if (this.offlineMode) {
      this.publishMessageOffline(msg)
      return
    }

    if (this.transportMode === 'endpoint') {
      this.publishMessageEndpoint(msg)
      return
    }

    this.publishMessageSupabase(msg)
  }

  private publishMessageOffline(msg: ClientMessage): void {
    switch (msg.type) {
      case 'JOIN': {
        if (this.joined) return
        this.username = this.sanitizeUsername(msg.payload.username)
        this.character = Math.max(0, Math.min(3, Math.floor(msg.payload.character)))
        this.joined = true
        break
      }
      case 'PLAYER_MOVE': {
        this.x = msg.payload.x
        this.y = msg.payload.y
        this.direction = msg.payload.direction
        this.isMoving = msg.payload.isMoving
        break
      }
      case 'CHAT': {
        const message = msg.payload.message.slice(0, 100)
        this.onMessage?.({ type: 'CHAT', payload: { id: this.localId, message } })
        break
      }
      case 'PING': {
        this.onMessage?.({ type: 'PONG', payload: { t: msg.payload.t, serverT: Date.now() } })
        break
      }
    }
  }

  private publishMessageEndpoint(msg: ClientMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify(msg))
  }

  private publishMessageSupabase(msg: ClientMessage): void {
    if (!this.channel) return

    switch (msg.type) {
      case 'JOIN': {
        if (this.joined) return
        this.username = this.sanitizeUsername(msg.payload.username)
        this.character = Math.max(0, Math.min(3, Math.floor(msg.payload.character)))
        this.joined = true
        this.updatePresence()
        break
      }
      case 'PLAYER_MOVE': {
        this.x = msg.payload.x
        this.y = msg.payload.y
        this.direction = msg.payload.direction
        this.isMoving = msg.payload.isMoving
        this.updatePresence()
        void this.channel.send({
          type: 'broadcast',
          event: 'player-move',
          payload: {
            id: this.localId,
            x: this.x,
            y: this.y,
            direction: this.direction,
            isMoving: this.isMoving,
          },
        })
        break
      }
      case 'CHAT': {
        const message = msg.payload.message.slice(0, 100)
        void this.channel.send({
          type: 'broadcast',
          event: 'chat',
          payload: {
            id: this.localId,
            message,
          },
        })
        this.onMessage?.({ type: 'CHAT', payload: { id: this.localId, message } })
        break
      }
      case 'PING': {
        this.onMessage?.({
          type: 'PONG',
          payload: { t: msg.payload.t, serverT: Date.now() },
        })
        break
      }
    }
  }

  private updatePresence(): void {
    if (!this.channel || !this.isSubscribed || !this.joined) return
    void this.channel.track({
      id: this.localId,
      username: this.username,
      character: this.character,
      x: this.x,
      y: this.y,
      direction: this.direction,
      isMoving: this.isMoving,
      onlineAt: new Date().toISOString(),
    })
  }

  private sanitizeUsername(raw: string): string {
    const username = raw.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 16).trim()
    return username.length > 0 ? username : 'Player'
  }

  private isDirection(value: unknown): value is PlayerState['direction'] {
    return value === 'up' || value === 'down' || value === 'left' || value === 'right'
  }

  private toPresenceState(value: unknown): PresenceState | null {
    if (!value || typeof value !== 'object') return null

    const record = value as Record<string, unknown>
    if (
      typeof record.id !== 'string' ||
      typeof record.username !== 'string' ||
      typeof record.character !== 'number' ||
      typeof record.x !== 'number' ||
      typeof record.y !== 'number' ||
      !this.isDirection(record.direction) ||
      typeof record.isMoving !== 'boolean' ||
      typeof record.onlineAt !== 'string'
    ) {
      return null
    }

    return {
      id: record.id,
      username: record.username,
      character: record.character,
      x: record.x,
      y: record.y,
      direction: record.direction,
      isMoving: record.isMoving,
      onlineAt: record.onlineAt,
    }
  }

  private scheduleReconnect(): void {
    if (this.offlineMode) return

    if (this.reconnectAttempts >= this.maxReconnectAttempts) return

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    this.reconnectAttempts++

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.enterOfflineMode()
      return
    }

    this.reconnectTimer = setTimeout(() => {
      if (this.transportMode === 'supabase') {
        if (this.channel) {
          void this.channel.unsubscribe()
          this.channel = null
        }
        this.createChannel()
        return
      }

      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
      this.createEndpointConnection()
    }, delay)
  }

  disconnect(): void {
    this.offlineMode = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.reconnectAttempts = this.maxReconnectAttempts // prevent reconnect
    this.isSubscribed = false

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.channel) {
      if (this.joined) {
        void this.channel.untrack()
      }
      void this.channel.unsubscribe()
      this.channel = null
    }
    this.joined = false
  }
}
