import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer, IncomingMessage } from 'http'
import type { Duplex } from 'stream'
import type { Socket } from 'net'
import { WebSocketServer, WebSocket } from 'ws'
import { RoomManager } from '@/server/roomManager'
import { RateLimiter } from '@/server/rateLimit'
import { applyApiRateLimit } from '@/server/httpRateLimit'
import type { ClientMessage } from '@/types/ws-protocol'

interface ExtendedServer extends HTTPServer {
  _wss?: WebSocketServer
}

interface AliveWebSocket extends WebSocket {
  isAlive?: boolean
}

interface SocketWithServer extends Socket {
  server: ExtendedServer
}

// Persist across HMR in development
const globalForWs = globalThis as unknown as {
  roomManager: RoomManager | undefined
  rateLimiter: RateLimiter | undefined
}

const roomManager = globalForWs.roomManager ?? new RoomManager()
const rateLimiter = globalForWs.rateLimiter ?? new RateLimiter()

if (process.env.NODE_ENV !== 'production') {
  globalForWs.roomManager = roomManager
  globalForWs.rateLimiter = rateLimiter
}

function handleConnection(ws: WebSocket): void {
  const socketId = roomManager.generateId()
  let joined = false
  let cleanedUp = false
  const client = ws as AliveWebSocket
  client.isAlive = true

  const cleanupConnection = () => {
    if (cleanedUp) return
    cleanedUp = true
    if (joined) roomManager.leave(socketId)
    rateLimiter.cleanup(socketId)
  }

  client.on('pong', () => {
    client.isAlive = true
  })

  ws.on('message', (raw: Buffer) => {
    if (!rateLimiter.check(socketId)) {
      ws.send(
        JSON.stringify({
          type: 'ERROR',
          payload: { code: 'RATE_LIMITED', message: 'Too many messages' },
        }),
      )
      return
    }

    let msg: ClientMessage
    try {
      msg = JSON.parse(raw.toString()) as ClientMessage
    } catch {
      return
    }

    if (!msg || !msg.type) return

    switch (msg.type) {
      case 'JOIN': {
        if (joined) return
        const username =
          typeof msg.payload?.username === 'string'
            ? msg.payload.username.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 16)
            : 'Player'
        if (!username.trim()) return
        const character =
          typeof msg.payload?.character === 'number'
            ? Math.max(0, Math.min(3, Math.floor(msg.payload.character)))
            : 0
        roomManager.join(socketId, ws, username, character)
        joined = true
        break
      }
      case 'PLAYER_MOVE': {
        if (!joined) return
        const p = msg.payload
        if (
          typeof p?.x !== 'number' ||
          typeof p?.y !== 'number' ||
          typeof p?.direction !== 'string' ||
          typeof p?.isMoving !== 'boolean'
        )
          return
        roomManager.move(socketId, p)
        break
      }
      case 'CHAT': {
        if (!joined) return
        const message =
          typeof msg.payload?.message === 'string' ? msg.payload.message.slice(0, 100) : ''
        if (!message.trim()) return
        roomManager.broadcastChat(socketId, message)
        break
      }
      case 'PING': {
        if (!joined) return
        ws.send(
          JSON.stringify({
            type: 'PONG',
            payload: { t: msg.payload?.t ?? 0, serverT: Date.now() },
          }),
        )
        break
      }
    }
  })

  ws.on('close', () => {
    cleanupConnection()
  })

  ws.on('error', () => {
    cleanupConnection()
  })
}

function setupWSS(server: ExtendedServer): void {
  if (server._wss) return

  const wss = new WebSocketServer({ noServer: true })
  server._wss = wss

  const heartbeatTimer = setInterval(() => {
    for (const ws of wss.clients) {
      const client = ws as AliveWebSocket
      if (client.isAlive === false) {
        ws.terminate()
        continue
      }
      client.isAlive = false
      ws.ping()
    }
  }, 30_000)

  server.on('upgrade', (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    const { pathname } = new URL(request.url ?? '/', `http://${request.headers.host}`)
    if (pathname === '/api/ws') {
      wss.handleUpgrade(request, socket, head, (client) => {
        wss.emit('connection', client, request)
      })
      return
    }

    ;(socket as Socket).destroy()
  })

  wss.on('close', () => {
    clearInterval(heartbeatTimer)
  })

  wss.on('connection', handleConnection)
}

export default function handler(_req: NextApiRequest, res: NextApiResponse): void {
  if (!applyApiRateLimit(_req, res, { maxRequests: 30, windowMs: 60_000 }, 'socket-bootstrap')) {
    return
  }

  const socket = res.socket as SocketWithServer | null
  if (socket?.server) {
    setupWSS(socket.server)
  }
  res.end()
}
