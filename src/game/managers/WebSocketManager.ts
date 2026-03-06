import type { ClientMessage, ServerMessage } from '@/types/ws-protocol'

type MessageHandler = (msg: ServerMessage) => void
type OpenHandler = () => void

export class WebSocketManager {
  private ws: WebSocket | null = null
  private onMessage: MessageHandler | null = null
  private onOpen: OpenHandler | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private pingTimer: ReturnType<typeof setInterval> | null = null
  private messageQueue: string[] = []
  private url: string

  constructor() {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      this.url = `${protocol}//${window.location.host}/api/ws`
    } else {
      this.url =
        (typeof process !== 'undefined'
          ? process.env.NEXT_PUBLIC_WS_URL
          : undefined) ?? 'ws://localhost:3000/api/ws'
    }
  }

  async connect(onMessage: MessageHandler, onOpen?: OpenHandler): Promise<void> {
    this.onMessage = onMessage
    this.onOpen = onOpen ?? null

    // Initialize the WebSocket server via HTTP endpoint
    try {
      await fetch('/api/socket')
    } catch {
      // Server might already be initialized
    }

    this.createConnection()
  }

  private createConnection(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.startPing()
      // Flush messages queued before the connection opened
      while (this.messageQueue.length > 0) {
        const data = this.messageQueue.shift()!
        if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(data)
      }
      this.onOpen?.()
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as ServerMessage
        this.onMessage?.(msg)
      } catch {
        // Ignore malformed messages
      }
    }

    this.ws.onclose = () => {
      this.stopPing()
      this.scheduleReconnect()
    }

    this.ws.onerror = () => {
      // onclose will fire after onerror
    }
  }

  send(msg: ClientMessage): void {
    const data = JSON.stringify(msg)
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      // Queue messages sent before connection opens
      // Keep only the latest PLAYER_MOVE to avoid stale position flood
      if (msg.type === 'PLAYER_MOVE') {
        const idx = this.messageQueue.findLastIndex((m) => m.includes('"PLAYER_MOVE"'))
        if (idx !== -1) this.messageQueue.splice(idx, 1)
      }
      this.messageQueue.push(data)
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    this.reconnectAttempts++

    this.reconnectTimer = setTimeout(() => {
      this.createConnection()
    }, delay)
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      this.send({ type: 'PING', payload: { t: Date.now() } })
    }, 30000)
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }

  disconnect(): void {
    this.stopPing()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.reconnectAttempts = this.maxReconnectAttempts // prevent reconnect
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
