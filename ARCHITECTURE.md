```import { useState } from "react";

const sections = [
{ id: "architecture", label: "01 System Architecture" },
{ id: "integration", label: "02 Next.js + Phaser" },
{ id: "structure", label: "03 Folder Structure" },
{ id: "multiplayer", label: "04 Multiplayer Sync" },
{ id: "protocol", label: "05 WS Protocol" },
{ id: "playerstate", label: "06 Player State" },
{ id: "interpolation", label: "07 Interpolation" },
{ id: "chat", label: "08 Chat Bubbles" },
{ id: "tilemap", label: "09 Tilemap System" },
{ id: "collision", label: "10 Collision System" },
{ id: "interaction", label: "11 Interaction System" },
{ id: "performance", label: "12 Performance" },
{ id: "deployment", label: "13 Vercel Deployment" },
{ id: "security", label: "14 Security" },
{ id: "roadmap", label: "15 Dev Roadmap" },
];

const Code = ({ children, lang = "" }) => (

  <pre style={{
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "16px",
    overflowX: "auto",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#e6edf3",
    margin: "12px 0",
    fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
  }}>
    {lang && <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang}</div>}
    <code>{children}</code>
  </pre>

);

const Tag = ({ children, color = "#238636" }) => (
<span style={{
    background: color + "22",
    border: `1px solid ${color}44`,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "11px",
    color: color,
    fontFamily: "monospace",
    marginRight: "6px",
  }}>{children}</span>
);

const Box = ({ title, children, accent = "#58a6ff" }) => (

  <div style={{
    border: `1px solid #30363d`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: "6px",
    padding: "16px 20px",
    margin: "16px 0",
    background: "#161b22",
  }}>
    {title && <div style={{ color: accent, fontWeight: "700", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>{title}</div>}
    {children}
  </div>
);

const Warn = ({ children }) => (

  <div style={{
    background: "#3d2b0022",
    border: "1px solid #d2991044",
    borderLeft: "3px solid #d29910",
    borderRadius: "6px",
    padding: "12px 16px",
    margin: "12px 0",
    color: "#d29910",
    fontSize: "13px",
  }}>⚠ {children}</div>
);

const Info = ({ children }) => (

  <div style={{
    background: "#1f6feb22",
    border: "1px solid #388bfd44",
    borderLeft: "3px solid #388bfd",
    borderRadius: "6px",
    padding: "12px 16px",
    margin: "12px 0",
    color: "#93c5fd",
    fontSize: "13px",
  }}>ℹ {children}</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const sections_content = {

architecture: () => (

  <div>
    <p style={{ color: "#8b949e", marginBottom: "24px" }}>
      Single-process architecture on Vercel using Next.js App Router for the shell, a custom WebSocket server bootstrapped alongside the HTTP server, and Phaser running exclusively client-side inside a React ref'd canvas.
    </p>

    <Box title="System Diagram" accent="#58a6ff">
      <Code lang="text">{`

┌─────────────────────────────────────────────────────────────────┐
│ BROWSER CLIENT │
│ │
│ ┌──────────────────┐ ┌─────────────────────────────────┐ │
│ │ Next.js Shell │ │ Phaser Game Engine │ │
│ │ (React + CSS) │ │ ┌───────────┐ ┌────────────┐ │ │
│ │ - Portfolio UI │ │ │ GameScene │ │ UIScene │ │ │
│ │ - Panel Modals │◄────│ │ (World) │ │ (Overlays) │ │ │
│ │ - HUD / Chat │ │ └───────────┘ └────────────┘ │ │
│ └──────────────────┘ │ ┌──────────────────────────┐ │ │
│ │ │ │ WebSocketManager │ │ │
│ │ │ │ PlayerStateManager │ │ │
│ │ │ │ InteractionManager │ │ │
│ │ └──┴──────────────────────────┴───┘ │
│ │ │ WS │
└───────────┼──────────────────────────────┼─────────────────────┘
│ │
│ VERCEL │
│ ┌───────────────────────────▼──────────────────┐ │
│ │ Next.js Server (Node.js) │ │
│ │ │ │
│ │ ┌────────────────┐ ┌─────────────────────┐ │ │
└──┤ │ App Router │ │ WebSocket Server │ │ │
│ │ /app/... │ │ (ws library) │ │ │
│ │ API Routes │ │ - Room Manager │ │ │
│ └────────────────┘ │ - Broadcast │ │ │
│ │ - Rate Limiting │ │ │
│ └─────────────────────┘ │ │
│ │ │
│ ┌───────────────────────────────────────┐ │ │
│ │ In-Memory State (Map<id, PlayerState>)│ │ │
│ └───────────────────────────────────────┘ │ │
└───────────────────────────────────────────────┘ │
`}</Code>
</Box>

    <Box title="Key Architectural Decisions" accent="#3fb950">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "1.8" }}>
        <p><strong style={{ color: "#3fb950" }}>No separate backend.</strong> The WebSocket server piggybacks on the Next.js custom server. Vercel supports long-lived connections in Node.js serverless functions via <code>server.js</code> bootstrap.</p>
        <p><strong style={{ color: "#3fb950" }}>Phaser is client-only.</strong> It never runs server-side. The Next.js page component lazy-imports Phaser behind a <code>dynamic(..., {'{'} ssr: false {'}'} )</code> boundary.</p>
        <p><strong style={{ color: "#3fb950" }}>State is ephemeral.</strong> No database. Player positions live in a <code>Map&lt;socketId, PlayerState&gt;</code> in the server process. On reconnect, players re-spawn at origin.</p>
        <p><strong style={{ color: "#3fb950" }}>UI decoupled from game.</strong> Portfolio panels (About, Projects, etc.) are React modals managed by a Zustand store. Phaser fires events that React listens to via an EventBus singleton.</p>
      </div>
    </Box>

    <Box title="Data Flow" accent="#d2a8ff">
      <Code lang="text">{`

Player presses ↑ key
→ Phaser detects input (60fps)
→ Movement validated locally (collision check)
→ Sprite moves immediately (client-side prediction)
→ Throttled WS emit (max 20/sec) → Server
→ Server validates, updates Map<id, state>
→ Server broadcasts delta to all OTHER clients
→ Remote clients receive update
→ Interpolate remote sprite toward new position
`}</Code>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
integration: () => (

  <div>
    <p style={{ color: "#8b949e", marginBottom: "20px" }}>
      The core challenge: Phaser manages its own canvas/requestAnimationFrame loop. React cannot own that DOM node. The solution is a strict boundary — React renders a container div, Phaser owns the canvas inside it, and they communicate only through an EventBus.
    </p>

    <Box title="PhaserGame Component" accent="#58a6ff">
      <Code lang="typescript">{`// components/PhaserGame.tsx

'use client';

import { useEffect, useRef } from 'react';
import { EventBus } from '@/game/EventBus';
import type { Game } from 'phaser';

interface PhaserGameProps {
onInteraction: (type: InteractionType) => void;
}

export default function PhaserGame({ onInteraction }: PhaserGameProps) {
const containerRef = useRef<HTMLDivElement>(null);
const gameRef = useRef<Game | null>(null);

useEffect(() => {
// Dynamic import: Phaser cannot run in SSR
const initGame = async () => {
const Phaser = (await import('phaser')).default;
const { GameScene } = await import('@/game/scenes/GameScene');
const { UIScene } = await import('@/game/scenes/UIScene');

      if (!containerRef.current || gameRef.current) return;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 480,
        height: 320,
        pixelArt: true,           // Critical: disables anti-aliasing
        antialias: false,
        roundPixels: true,        // Prevents sub-pixel rendering artifacts
        parent: containerRef.current,
        backgroundColor: '#1a1a2e',
        physics: { default: 'arcade', arcade: { debug: false } },
        scene: [GameScene, UIScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });

      // React listens to game events
      EventBus.on('interaction', onInteraction);
    };

    initGame();

    return () => {
      EventBus.removeAllListeners('interaction');
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };

}, []); // Run once only

return (
<div
ref={containerRef}
style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
/>
);
}`}</Code>
</Box>

    <Box title="EventBus — The Phaser↔React Bridge" accent="#3fb950">
      <Code lang="typescript">{`// game/EventBus.ts

import Phaser from 'phaser';

// Singleton event emitter shared between Phaser scenes and React
export const EventBus = new Phaser.Events.EventEmitter();

// Typed event constants
export const GameEvents = {
INTERACTION: 'interaction', // Phaser → React: open panel
CHAT_SENT: 'chat:sent', // React → Phaser: send message
SCENE_READY: 'scene:ready', // Phaser → React: scene loaded
USERNAME_SET: 'username:set', // React → Phaser: player name
} as const;

// Usage in Phaser scene:
// EventBus.emit(GameEvents.INTERACTION, { type: 'lab' });
//
// Usage in React:
// EventBus.on(GameEvents.INTERACTION, (e) => openPanel(e.type));`}</Code>
</Box>

    <Box title="Next.js Page Integration" accent="#f78166">
      <Code lang="typescript">{`// app/page.tsx

'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import AboutPanel from '@/components/panels/AboutPanel';
import ProjectsPanel from '@/components/panels/ProjectsPanel';

// Never SSR the game component
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
ssr: false,
loading: () => <LoadingScreen />,
});

export default function HomePage() {
const { activePanel, closePanel } = useGameStore();

return (
<main style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
{/_ Game canvas fills the viewport _/}
<PhaserGame onInteraction={(type) => useGameStore.getState().openPanel(type)} />

      {/* React UI layers on top */}
      {activePanel === 'about'    && <AboutPanel    onClose={closePanel} />}
      {activePanel === 'projects' && <ProjectsPanel onClose={closePanel} />}
      {activePanel === 'contact'  && <ContactPanel  onClose={closePanel} />}
      {activePanel === 'career'   && <CareerPanel   onClose={closePanel} />}

      <HUD />
      <ChatInput />
    </main>

);
}`}</Code>
</Box>

    <Info>Use <code>pixelArt: true</code> and <code>roundPixels: true</code> in Phaser config. Without these, your 16×16 tiles will appear blurry when scaled up on high-DPI screens.</Info>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
structure: () => (

  <div>
    <Code lang="text">{`pokemon-portfolio/
├── app/
│   ├── layout.tsx                # Root layout, fonts, metadata
│   ├── page.tsx                  # Main game page
│   └── api/
│       └── health/route.ts       # Health check endpoint
│
├── components/
│   ├── PhaserGame.tsx            # Phaser canvas wrapper (CSR only)
│   ├── HUD.tsx                   # Username display, mini-map
│   ├── ChatInput.tsx             # Chat text input (React-managed)
│   ├── UsernameModal.tsx         # Initial username prompt
│   └── panels/
│       ├── AboutPanel.tsx
│       ├── ProjectsPanel.tsx
│       ├── ContactPanel.tsx
│       └── CareerPanel.tsx
│
├── game/
│   ├── EventBus.ts               # Phaser↔React bridge
│   ├── config.ts                 # Phaser game config
│   │
│   ├── scenes/
│   │   ├── BootScene.ts          # Preload all assets
│   │   ├── GameScene.ts          # Main world scene
│   │   └── UIScene.ts            # Overlay scene (chat bubbles, name tags)
│   │
│   ├── entities/
│   │   ├── LocalPlayer.ts        # Player controlled by THIS client
│   │   └── RemotePlayer.ts       # Other players (interpolated)
│   │
│   ├── managers/
│   │   ├── WebSocketManager.ts   # WS connection + message dispatch
│   │   ├── PlayerStateManager.ts # Tracks all remote player states
│   │   ├── InteractionManager.ts # E-key proximity detection
│   │   ├── ChatBubbleManager.ts  # Creates/destroys chat bubbles
│   │   └── MovementThrottle.ts   # Limits WS emit rate
│   │
│   ├── map/
│   │   ├── CollisionLayer.ts     # Tree/building collision map
│   │   ├── MapDefinition.ts      # Tilemap JSON config
│   │   └── InteractionZones.ts   # Building proximity zones
│   │
│   └── types/
│       └── index.ts              # Shared game types
│
├── server/
│   ├── wsServer.ts               # WebSocket server setup
│   ├── roomManager.ts            # Player room state
│   └── rateLimit.ts              # Per-socket rate limiting
│
├── store/
│   └── gameStore.ts              # Zustand: UI state (active panel, etc.)
│
├── public/
│   └── assets/
│       ├── tilemaps/
│       │   ├── littleroot.json   # Tiled map export
│       │   └── tileset.png       # 16x16 tileset image
│       └── sprites/
│           ├── player.png        # 16x16 player sprite sheet
│           └── overworld.png     # NPC/object sprites
│
├── types/
│   └── ws-protocol.ts            # Shared server↔client message types
│
├── server.js                     # Custom Node.js server (WS bootstrap)
└── next.config.ts`}</Code>

    <Box title="Critical Files" accent="#f78166">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2" }}>
        <div><code style={{ color: "#79c0ff" }}>server.js</code> — Custom server is required to attach a WebSocket server to the same HTTP instance that Next.js uses. Without this, you cannot run WS on Vercel without a separate service.</div>
        <div><code style={{ color: "#79c0ff" }}>game/EventBus.ts</code> — The only sanctioned bridge between Phaser and React. All cross-boundary communication goes through here.</div>
        <div><code style={{ color: "#79c0ff" }}>types/ws-protocol.ts</code> — Shared types imported by both <code>server/</code> and <code>game/</code>. This is your source of truth for the WS message contract.</div>
      </div>
    </Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
multiplayer: () => (

  <div>
    <Box title="Sync Strategy: Authority Model" accent="#58a6ff">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "1.8" }}>
        <p><strong style={{ color: "#58a6ff" }}>Client-authoritative movement</strong> — The local player moves immediately without waiting for server confirmation. The server relays position updates to other clients. There is no server-side position validation beyond basic sanity checks (max speed, bounds check).</p>
        <p>This trades cheat-resistance for responsiveness. For a portfolio, this is the correct tradeoff. Nobody is trying to exploit your portfolio.</p>
      </div>
    </Box>

    <Box title="Throttled Emit Strategy" accent="#3fb950">
      <Code lang="typescript">{`// game/managers/MovementThrottle.ts

export class MovementThrottle {
private lastEmit = 0;
private pendingState: PlayerPosition | null = null;
private readonly EMIT_INTERVAL_MS = 50; // 20 updates/sec max

constructor(private ws: WebSocketManager) {}

push(position: PlayerPosition): void {
this.pendingState = position;
const now = Date.now();

    if (now - this.lastEmit >= this.EMIT_INTERVAL_MS) {
      this.flush();
    }
    // If under threshold: pendingState holds latest, flush on next tick

}

private flush(): void {
if (!this.pendingState) return;
this.ws.send({ type: 'PLAYER_MOVE', payload: this.pendingState });
this.lastEmit = Date.now();
this.pendingState = null;
}

// Call this in Phaser's update() loop
tick(): void {
const now = Date.now();
if (this.pendingState && now - this.lastEmit >= this.EMIT_INTERVAL_MS) {
this.flush();
}
}
}`}</Code>
</Box>

    <Box title="Server Room Manager" accent="#d2a8ff">
      <Code lang="typescript">{`// server/roomManager.ts

import type { WebSocket } from 'ws';
import type { PlayerState } from '@/types/ws-protocol';

export class RoomManager {
private players = new Map<string, PlayerState>();
private sockets = new Map<string, WebSocket>();

join(socketId: string, ws: WebSocket, username: string): void {
const state: PlayerState = {
id: socketId,
username: username.slice(0, 16).trim(), // Sanitize
x: SPAWN_X,
y: SPAWN_Y,
direction: 'down',
isMoving: false,
};
this.players.set(socketId, state);
this.sockets.set(socketId, ws);

    // Send existing players to new joiner
    this.sendTo(socketId, {
      type: 'ROOM_STATE',
      payload: { players: this.getOtherPlayers(socketId) },
    });

    // Announce new player to others
    this.broadcast(socketId, {
      type: 'PLAYER_JOIN',
      payload: state,
    });

}

move(socketId: string, pos: Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'>): void {
const player = this.players.get(socketId);
if (!player) return;

    // Basic sanity check: max ~4 tiles/sec = 64px/sec
    const MAX_DELTA = 80;
    if (Math.abs(pos.x - player.x) > MAX_DELTA || Math.abs(pos.y - player.y) > MAX_DELTA) {
      console.warn(\`[RoomManager] Suspiciously large delta from \${socketId}\`);
      return;
    }

    Object.assign(player, pos);

    this.broadcast(socketId, {
      type: 'PLAYER_MOVE',
      payload: { id: socketId, ...pos },
    });

}

leave(socketId: string): void {
this.players.delete(socketId);
this.sockets.delete(socketId);
this.broadcast(socketId, { type: 'PLAYER_LEAVE', payload: { id: socketId } });
}

private broadcast(excludeId: string, msg: object): void {
const data = JSON.stringify(msg);
this.sockets.forEach((ws, id) => {
if (id !== excludeId && ws.readyState === ws.OPEN) {
ws.send(data);
}
});
}

private sendTo(id: string, msg: object): void {
this.sockets.get(id)?.send(JSON.stringify(msg));
}

private getOtherPlayers(excludeId: string): PlayerState[] {
return [...this.players.values()].filter(p => p.id !== excludeId);
}
}`}</Code>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
protocol: () => (

  <div>
    <Box title="Message Type Definitions (Shared)" accent="#58a6ff">
      <Code lang="typescript">{`// types/ws-protocol.ts
// This file is imported by BOTH server/ and game/ — it is the contract.

export interface PlayerState {
id: string;
username: string;
x: number;
y: number;
direction: 'up' | 'down' | 'left' | 'right';
isMoving: boolean;
}

// ── Client → Server ──────────────────────────────────────────────────────────

export type ClientMessage =
| { type: 'JOIN'; payload: { username: string } }
| { type: 'PLAYER_MOVE'; payload: Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'> }
| { type: 'CHAT'; payload: { message: string } }
| { type: 'PING'; payload: { t: number } };

// ── Server → Client ──────────────────────────────────────────────────────────

export type ServerMessage =
| { type: 'ROOM_STATE'; payload: { players: PlayerState[]; yourId: string } }
| { type: 'PLAYER_JOIN'; payload: PlayerState }
| { type: 'PLAYER_MOVE'; payload: Pick<PlayerState, 'id' | 'x' | 'y' | 'direction' | 'isMoving'> }
| { type: 'PLAYER_LEAVE'; payload: { id: string } }
| { type: 'CHAT'; payload: { id: string; message: string } }
| { type: 'PONG'; payload: { t: number; serverT: number } }
| { type: 'ERROR'; payload: { code: string; message: string } };`}</Code>
</Box>

    <Box title="Message Design Rules" accent="#3fb950">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2" }}>
        <p>• <strong style={{ color: "#3fb950" }}>PLAYER_MOVE is the hot path.</strong> Keep the payload minimal — only x, y, direction, isMoving. No username, no timestamp.</p>
        <p>• <strong style={{ color: "#3fb950" }}>ROOM_STATE includes yourId.</strong> The client needs to know its own socket ID to differentiate self from others.</p>
        <p>• <strong style={{ color: "#3fb950" }}>PING/PONG for latency.</strong> Measure round-trip time on the client. Use this to tune interpolation buffer.</p>
        <p>• <strong style={{ color: "#3fb950" }}>No acks on movement.</strong> Fire-and-forget. Reliability is not needed for position updates.</p>
        <p>• <strong style={{ color: "#3fb950" }}>CHAT is broadcast-only.</strong> No history, no persistence. Messages appear as bubbles and fade.</p>
      </div>
    </Box>

    <Box title="WebSocket Server Bootstrap" accent="#f78166">
      <Code lang="javascript">{`// server.js (root — custom Next.js server)

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');
const { RoomManager } = require('./server/roomManager');
const { RateLimiter } = require('./server/rateLimit');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
const httpServer = createServer((req, res) => {
const parsedUrl = parse(req.url, true);
handle(req, res, parsedUrl);
});

const wss = new WebSocketServer({ server: httpServer });
const room = new RoomManager();
const limiter = new RateLimiter();

wss.on('connection', (ws) => {
const socketId = crypto.randomUUID();
let joined = false;

    ws.on('message', (raw) => {
      // Rate limit: 30 messages/sec max per socket
      if (!limiter.check(socketId)) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: { code: 'RATE_LIMITED', message: 'Slow down' } }));
        return;
      }

      let msg;
      try { msg = JSON.parse(raw.toString()); }
      catch { return; } // Silently drop malformed JSON

      if (!joined && msg.type !== 'JOIN') return; // Must JOIN first

      switch (msg.type) {
        case 'JOIN':
          if (joined) return;
          room.join(socketId, ws, msg.payload.username);
          ws.send(JSON.stringify({ type: 'ROOM_STATE', payload: { ...room.getRoomState(socketId), yourId: socketId } }));
          joined = true;
          break;
        case 'PLAYER_MOVE':
          room.move(socketId, msg.payload);
          break;
        case 'CHAT':
          const clean = String(msg.payload.message).slice(0, 100).trim();
          if (clean) room.broadcast_chat(socketId, clean);
          break;
        case 'PING':
          ws.send(JSON.stringify({ type: 'PONG', payload: { t: msg.payload.t, serverT: Date.now() } }));
          break;
      }
    });

    ws.on('close', () => {
      if (joined) room.leave(socketId);
      limiter.cleanup(socketId);
    });

});

httpServer.listen(3000, () => {
console.log('> Ready on http://localhost:3000');
});
});`}</Code>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
playerstate: () => (

  <div>
    <Box title="PlayerStateManager" accent="#58a6ff">
      <Code lang="typescript">{`// game/managers/PlayerStateManager.ts
import type { ServerMessage, PlayerState } from '@/types/ws-protocol';
import { RemotePlayer } from '@/game/entities/RemotePlayer';
import type { GameScene } from '@/game/scenes/GameScene';

export class PlayerStateManager {
private remotePlayers = new Map<string, RemotePlayer>();

constructor(private scene: GameScene) {}

handleServerMessage(msg: ServerMessage): void {
switch (msg.type) {

      case 'ROOM_STATE':
        // Hydrate all existing players on join
        msg.payload.players.forEach(p => this.addPlayer(p));
        break;

      case 'PLAYER_JOIN':
        this.addPlayer(msg.payload);
        break;

      case 'PLAYER_MOVE':
        this.remotePlayers.get(msg.payload.id)?.enqueuePosition(msg.payload);
        break;

      case 'PLAYER_LEAVE':
        this.removePlayer(msg.payload.id);
        break;

      case 'CHAT':
        this.remotePlayers.get(msg.payload.id)?.showChat(msg.payload.message);
        break;
    }

}

private addPlayer(state: PlayerState): void {
if (this.remotePlayers.has(state.id)) return;
const player = new RemotePlayer(this.scene, state);
this.remotePlayers.set(state.id, player);
}

private removePlayer(id: string): void {
this.remotePlayers.get(id)?.destroy();
this.remotePlayers.delete(id);
}

update(delta: number): void {
this.remotePlayers.forEach(p => p.update(delta));
}

destroy(): void {
this.remotePlayers.forEach(p => p.destroy());
this.remotePlayers.clear();
}
}`}</Code>
</Box>

    <Box title="LocalPlayer Entity" accent="#3fb950">
      <Code lang="typescript">{`// game/entities/LocalPlayer.ts

import Phaser from 'phaser';
import { MovementThrottle } from '@/game/managers/MovementThrottle';
import type { WebSocketManager } from '@/game/managers/WebSocketManager';

const TILE_SIZE = 16;
const MOVE_SPEED_MS = 200; // ms to traverse one tile (Pokémon-style)

export class LocalPlayer {
sprite: Phaser.GameObjects.Sprite;
private tween: Phaser.Tweens.Tween | null = null;
private isMoving = false;
private throttle: MovementThrottle;
private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
private interactKey: Phaser.Input.Keyboard.Key;

// Tile-grid position (not pixel)
tileX = 5;
tileY = 5;
direction: 'up' | 'down' | 'left' | 'right' = 'down';

constructor(scene: Phaser.Scene, ws: WebSocketManager, startTileX: number, startTileY: number) {
this.tileX = startTileX;
this.tileY = startTileY;
this.throttle = new MovementThrottle(ws);
this.cursors = scene.input.keyboard!.createCursorKeys();
this.interactKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.sprite = scene.add.sprite(
      startTileX * TILE_SIZE + TILE_SIZE / 2,
      startTileY * TILE_SIZE + TILE_SIZE / 2,
      'player'
    );
    this.sprite.setDepth(10);
    scene.cameras.main.startFollow(this.sprite, true, 0.1, 0.1);

}

update(delta: number, collisionMap: boolean[][]): void {
this.throttle.tick();
if (this.isMoving) return; // Grid-locked: wait for current move to finish

    let dx = 0, dy = 0;
    if      (this.cursors.up.isDown)    { dy = -1; this.direction = 'up';    }
    else if (this.cursors.down.isDown)  { dy =  1; this.direction = 'down';  }
    else if (this.cursors.left.isDown)  { dx = -1; this.direction = 'left';  }
    else if (this.cursors.right.isDown) { dx =  1; this.direction = 'right'; }
    else return;

    const nextX = this.tileX + dx;
    const nextY = this.tileY + dy;

    // Play walking animation frame immediately (face direction even if blocked)
    this.sprite.setFrame(this.getDirectionFrame());

    if (collisionMap[nextY]?.[nextX]) return; // Blocked

    this.tileX = nextX;
    this.tileY = nextY;
    this.isMoving = true;

    this.tween = this.sprite.scene.tweens.add({
      targets: this.sprite,
      x: nextX * TILE_SIZE + TILE_SIZE / 2,
      y: nextY * TILE_SIZE + TILE_SIZE / 2,
      duration: MOVE_SPEED_MS,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.throttle.push({ x: this.tileX, y: this.tileY, direction: this.direction, isMoving: false });
      },
    });

    this.throttle.push({ x: this.tileX, y: this.tileY, direction: this.direction, isMoving: true });

}

private getDirectionFrame(): number {
return { down: 0, up: 4, left: 8, right: 12 }[this.direction];
}
}`}</Code>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
interpolation: () => (

  <div>
    <p style={{ color: "#8b949e", marginBottom: "20px" }}>
      Remote players receive position updates at ~20/sec. Without interpolation, they teleport. The strategy: maintain a small buffer of received states and lerp the visual position toward the next queued target.
    </p>

    <Box title="RemotePlayer with Interpolation" accent="#58a6ff">
      <Code lang="typescript">{`// game/entities/RemotePlayer.ts

import Phaser from 'phaser';
import type { PlayerState } from '@/types/ws-protocol';

const TILE_SIZE = 16;
const INTERPOLATION_BUFFER = 2; // Hold N states before consuming
const MOVE_SPEED_MS = 200;

interface PositionSnapshot {
x: number; y: number;
direction: PlayerState['direction'];
isMoving: boolean;
timestamp: number;
}

export class RemotePlayer {
sprite: Phaser.GameObjects.Sprite;
nameTag: Phaser.GameObjects.Text;
private positionBuffer: PositionSnapshot[] = [];
private currentTween: Phaser.Tweens.Tween | null = null;

constructor(private scene: Phaser.Scene, state: PlayerState) {
this.sprite = scene.add.sprite(
state.x _ TILE_SIZE + TILE_SIZE / 2,
state.y _ TILE_SIZE + TILE_SIZE / 2,
'player'
);
this.sprite.setDepth(9);
this.sprite.setTint(0xaaaaff); // Tint to distinguish from local player

    this.nameTag = scene.add.text(
      this.sprite.x, this.sprite.y - 14,
      state.username,
      { fontSize: '8px', color: '#ffffff', stroke: '#000000', strokeThickness: 2 }
    ).setOrigin(0.5).setDepth(20);

}

enqueuePosition(pos: Omit<PositionSnapshot, 'timestamp'>): void {
this.positionBuffer.push({ ...pos, timestamp: Date.now() });
// Keep buffer bounded
if (this.positionBuffer.length > 5) {
this.positionBuffer.shift();
}
}

update(\_delta: number): void {
// Only consume from buffer when not currently tweening
if (this.currentTween?.isPlaying() || this.positionBuffer.length < INTERPOLATION_BUFFER) {
this.updateNameTagPosition();
return;
}

    const target = this.positionBuffer.shift()!;
    const targetPx = { x: target.x * TILE_SIZE + TILE_SIZE / 2, y: target.y * TILE_SIZE + TILE_SIZE / 2 };

    // If too far (disconnect + reconnect), snap instead of lerp
    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, targetPx.x, targetPx.y);
    if (dist > TILE_SIZE * 5) {
      this.sprite.setPosition(targetPx.x, targetPx.y);
      this.currentTween = null;
      return;
    }

    this.currentTween = this.scene.tweens.add({
      targets: this.sprite,
      x: targetPx.x,
      y: targetPx.y,
      duration: MOVE_SPEED_MS,
      ease: 'Linear',
      onComplete: () => { this.currentTween = null; },
    });

}

private updateNameTagPosition(): void {
this.nameTag.setPosition(this.sprite.x, this.sprite.y - 14);
}

showChat(message: string): void {
// Delegates to ChatBubbleManager
this.scene.events.emit('show-chat-bubble', { sprite: this.sprite, message });
}

destroy(): void {
this.currentTween?.stop();
this.sprite.destroy();
this.nameTag.destroy();
}
}`}</Code>
</Box>

    <Info>The <strong>INTERPOLATION_BUFFER = 2</strong> introduces ~100ms of lag for remote players (2 × 50ms emit interval). This is intentional — it smooths movement without excessive delay. Tune this based on your measured latency.</Info>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
chat: () => (

  <div>
    <Box title="ChatBubbleManager" accent="#58a6ff">
      <Code lang="typescript">{`// game/managers/ChatBubbleManager.ts
import Phaser from 'phaser';

const BUBBLE_DURATION_MS = 4000;
const BUBBLE_FADE_MS = 500;
const MAX_CHARS = 60;

interface ChatBubble {
container: Phaser.GameObjects.Container;
target: Phaser.GameObjects.Sprite;
timer: Phaser.Time.TimerEvent;
}

export class ChatBubbleManager {
private bubbles = new Map<string, ChatBubble>();

constructor(private scene: Phaser.Scene) {
// Listen for events from RemotePlayer.showChat
scene.events.on('show-chat-bubble', this.show, this);
}

show({ sprite, message, id }: { sprite: Phaser.GameObjects.Sprite; message: string; id: string }): void {
// Remove existing bubble for this player
this.dismiss(id);

    const text = message.slice(0, MAX_CHARS) + (message.length > MAX_CHARS ? '…' : '');
    const padding = 6;

    const label = this.scene.add.text(0, 0, text, {
      fontSize: '7px',
      color: '#111111',
      wordWrap: { width: 80 },
      lineSpacing: 2,
    }).setOrigin(0.5, 1);

    const bounds = label.getBounds();
    const bw = bounds.width + padding * 2;
    const bh = bounds.height + padding * 2;

    // Bubble background (rounded rect)
    const bg = this.scene.add.graphics();
    bg.fillStyle(0xffffff, 0.92);
    bg.fillRoundedRect(-bw / 2, -bh, bw, bh, 4);
    // Tail triangle
    bg.fillTriangle(-4, 0, 4, 0, 0, 5);

    const container = this.scene.add.container(sprite.x, sprite.y - 20, [bg, label]);
    container.setDepth(30);
    container.setAlpha(0);

    this.scene.tweens.add({ targets: container, alpha: 1, duration: 150, ease: 'Sine.Out' });

    const timer = this.scene.time.addEvent({
      delay: BUBBLE_DURATION_MS,
      callback: () => this.dismiss(id),
    });

    this.bubbles.set(id, { container, target: sprite, timer });

}

dismiss(id: string): void {
const bubble = this.bubbles.get(id);
if (!bubble) return;

    bubble.timer.remove();
    this.scene.tweens.add({
      targets: bubble.container,
      alpha: 0,
      duration: BUBBLE_FADE_MS,
      onComplete: () => bubble.container.destroy(),
    });
    this.bubbles.delete(id);

}

// Call in scene update() to keep bubbles anchored to moving sprites
update(): void {
this.bubbles.forEach((bubble) => {
bubble.container.setPosition(bubble.target.x, bubble.target.y - 20);
});
}

destroy(): void {
this.bubbles.forEach(b => { b.timer.remove(); b.container.destroy(); });
this.bubbles.clear();
this.scene.events.off('show-chat-bubble', this.show, this);
}
}`}</Code>
</Box>

    <Box title="ChatInput (React Component)" accent="#3fb950">
      <Code lang="typescript">{`// components/ChatInput.tsx

'use client';

import { useState, useRef } from 'react';
import { EventBus, GameEvents } from '@/game/EventBus';

export default function ChatInput() {
const [open, setOpen] = useState(false);
const [value, setValue] = useState('');
const inputRef = useRef<HTMLInputElement>(null);

// ENTER key opens the chat (intercepted in Phaser scene too)
// We use a global keydown listener here to avoid conflicts
useState(() => {
const handler = (e: KeyboardEvent) => {
if (e.key === 'Enter' && !open) { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }
if (e.key === 'Escape') { setOpen(false); setValue(''); }
};
window.addEventListener('keydown', handler);
return () => window.removeEventListener('keydown', handler);
});

const send = () => {
if (!value.trim()) { setOpen(false); return; }
EventBus.emit(GameEvents.CHAT_SENT, value.trim());
setValue('');
setOpen(false);
};

if (!open) return (
<div style={{ position: 'fixed', bottom: 16, left: 16, color: '#fff8', fontSize: '11px' }}>
Press ENTER to chat
</div>
);

return (
<div style={{ position: 'fixed', bottom: 16, left: 16, display: 'flex', gap: 8 }}>
<input
ref={inputRef}
value={value}
onChange={e => setValue(e.target.value)}
onKeyDown={e => e.key === 'Enter' && send()}
maxLength={100}
placeholder="Say something..."
style={{ background: '#000c', border: '1px solid #fff4', color: '#fff', padding: '6px 10px', fontSize: '12px', borderRadius: 4, width: 200 }}
/>
<button onClick={send} style={{ background: '#fff2', border: '1px solid #fff4', color: '#fff', padding: '6px 12px', fontSize: '12px', borderRadius: 4, cursor: 'pointer' }}>
Send
</button>
</div>
);
}`}</Code>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
tilemap: () => (

  <div>
    <Box title="Tiled Map Editor → Phaser Pipeline" accent="#58a6ff">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "1.8", marginBottom: "16px" }}>
        <p>Use <a href="https://www.mapeditor.org/" style={{ color: "#58a6ff" }}>Tiled</a> to design the map. Export as JSON. The recommended layer structure:</p>
      </div>
      <Code lang="text">{`Layers (bottom to top):
  Ground      — grass, dirt paths (walkable)
  Details     — flowers, pebbles (walkable)
  Buildings   — house walls, lab walls (collide)
  Trees       — border trees, decorative (collide)
  Overhead    — tree tops, roof overhangs (above player, depth sorted)
  Objects     — Tiled "Object Layer" for interaction zones (not rendered)

Tileset: 16×16 tiles, exported as tileset.png + tileset.json`}</Code>
</Box>

    <Box title="Loading the Tilemap in Phaser" accent="#3fb950">
      <Code lang="typescript">{`// game/scenes/BootScene.ts — preload

preload() {
this.load.tilemapTiledJSON('littleroot', '/assets/tilemaps/littleroot.json');
this.load.image('tileset', '/assets/tilemaps/tileset.png');
this.load.spritesheet('player', '/assets/sprites/player.png', {
frameWidth: 16, frameHeight: 16,
});
}

// game/scenes/GameScene.ts — create
create() {
const map = this.make.tilemap({ key: 'littleroot' });
const tileset = map.addTilesetImage('tileset', 'tileset');

// Render layers
const groundLayer = map.createLayer('Ground', tileset, 0, 0)!;
const detailLayer = map.createLayer('Details', tileset, 0, 0)!;
const buildingLayer = map.createLayer('Buildings', tileset, 0, 0)!;
const treeLayer = map.createLayer('Trees', tileset, 0, 0)!;
const overheadLayer = map.createLayer('Overhead', tileset, 0, 0)!;

// Configure collision by tile property "collides" set in Tiled
buildingLayer.setCollisionByProperty({ collides: true });
treeLayer.setCollisionByProperty({ collides: true });

// Overhead renders above player
overheadLayer.setDepth(50);

// Physics world bounds = map bounds
this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

// Store collision map for LocalPlayer grid-movement checks
this.collisionMap = this.buildCollisionArray(map, ['Buildings', 'Trees']);
}

private buildCollisionArray(map: Phaser.Tilemaps.Tilemap, layerNames: string[]): boolean[][] {
const grid: boolean[][] = Array.from({ length: map.height }, () =>
new Array(map.width).fill(false)
);
layerNames.forEach(name => {
const layer = map.getLayer(name);
layer?.data.forEach((row, y) =>
row.forEach((tile, x) => {
if (tile.properties?.collides) grid[y][x] = true;
})
);
});
return grid;
}`}</Code>
</Box>

    <Warn>Always set tile properties in Tiled (not programmatically) for collision. This keeps your collision data in version control alongside your map file.</Warn>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
collision: () => (

  <div>
    <Box title="Dual Collision Approach" accent="#58a6ff">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "1.8" }}>
        <p>Grid movement requires a boolean collision array (fast O(1) tile lookup). Phaser's built-in arcade physics is used as a backup for non-grid objects if needed.</p>
      </div>
    </Box>

    <Box title="CollisionLayer" accent="#3fb950">
      <Code lang="typescript">{`// game/map/CollisionLayer.ts

export class CollisionLayer {
private grid: Uint8Array; // 1 = blocked, 0 = free

constructor(
private readonly width: number,
private readonly height: number,
tileData: Phaser.Tilemaps.Tile[][]
) {
this.grid = new Uint8Array(width _ height);
tileData.forEach((row, y) =>
row.forEach((tile, x) => {
if (tile?.properties?.collides) {
this.grid[y _ width + x] = 1;
}
})
);
}

isBlocked(tileX: number, tileY: number): boolean {
// Out of bounds = blocked
if (tileX < 0 || tileY < 0 || tileX >= this.width || tileY >= this.height) {
return true;
}
return this.grid[tileY * this.width + tileX] === 1;
}

// Debug: draw collision overlay (development only)
debugDraw(scene: Phaser.Scene): void {
if (process.env.NODE_ENV !== 'development') return;
const graphics = scene.add.graphics().setDepth(100).setAlpha(0.3);
for (let y = 0; y < this.height; y++) {
for (let x = 0; x < this.width; x++) {
if (this.isBlocked(x, y)) {
graphics.fillStyle(0xff0000).fillRect(x _ 16, y _ 16, 16, 16);
}
}
}
}
}`}</Code>
</Box>

    <Box title="Map Design Rules for Littleroot-style Collision" accent="#d2a8ff">
      <Code lang="text">{`Map: ~20×15 tiles (320×240px internal, scaled 2x = 640×480 viewport)

Border design:
Row 0-1: Full tree row (blocked)
Col 0-1: Full tree column (blocked)
Col width-1-2: Full tree column (blocked)
Row height-1-2: Full tree row (blocked)

Houses:

- 4×4 tile footprint
- Wall tiles: collides=true
- Door tile: collides=false (walkable)
- Use a separate "interaction zone" object (not collision)

North path gap:

- Break tree border with 2-tile-wide path
- Place invisible "trigger zone" object there
- InteractionManager checks proximity, not collision

Tree collision tip:

- Mark only the BASE row of trees as collides=true
- Tree tops go on the Overhead layer (depth > player)
- This lets the player walk "behind" tree trunks visually`}</Code>
</Box>
  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
interaction: () => (

  <div>
    <Box title="Interaction Zone System" accent="#58a6ff">
      <Code lang="typescript">{`// game/map/InteractionZones.ts
export interface InteractionZone {
  id:    string;
  type:  'about' | 'projects' | 'contact' | 'career' | 'placeholder';
  label: string;        // "Press E" hint text
  tiles: Array<{ x: number; y: number }>; // Tiles that trigger this zone
}

// Defined once, matches your Tiled Object Layer
export const INTERACTION_ZONES: InteractionZone[] = [
{
id: 'house-main',
type: 'about',
label: 'House [E]',
tiles: [{ x: 5, y: 8 }, { x: 6, y: 8 }], // Door tiles
},
{
id: 'lab',
type: 'projects',
label: 'Lab [E]',
tiles: [{ x: 14, y: 8 }, { x: 15, y: 8 }],
},
{
id: 'mailbox',
type: 'contact',
label: 'Mailbox [E]',
tiles: [{ x: 7, y: 9 }],
},
{
id: 'north-path',
type: 'career',
label: 'Route 101 [E]',
tiles: [{ x: 9, y: 0 }, { x: 10, y: 0 }, { x: 9, y: 1 }, { x: 10, y: 1 }],
},
{
id: 'neighbor-house',
type: 'placeholder',
label: '??? [E]',
tiles: [{ x: 5, y: 4 }, { x: 6, y: 4 }],
},
];`}</Code>
</Box>

    <Box title="InteractionManager" accent="#3fb950">
      <Code lang="typescript">{`// game/managers/InteractionManager.ts

import Phaser from 'phaser';
import { INTERACTION_ZONES, type InteractionZone } from '@/game/map/InteractionZones';
import { EventBus, GameEvents } from '@/game/EventBus';
import type { LocalPlayer } from '@/game/entities/LocalPlayer';

export class InteractionManager {
private interactKey: Phaser.Input.Keyboard.Key;
private hintText: Phaser.GameObjects.Text;
private activeZone: InteractionZone | null = null;

constructor(private scene: Phaser.Scene) {
this.interactKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Hint text (positioned relative to player in update)
    this.hintText = scene.add.text(0, 0, '', {
      fontSize: '7px', color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 },
    }).setDepth(40).setVisible(false);

}

update(player: LocalPlayer): void {
const zone = this.getNearbyZone(player.tileX, player.tileY);

    if (zone !== this.activeZone) {
      this.activeZone = zone;
      if (zone) {
        this.hintText.setText(zone.label).setVisible(true);
      } else {
        this.hintText.setVisible(false);
      }
    }

    // Update hint position
    if (this.activeZone) {
      this.hintText.setPosition(player.sprite.x - this.hintText.width / 2, player.sprite.y - 28);
    }

    // Trigger on E press (Phaser.Input.Keyboard.JustDown prevents hold-repeat)
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) && this.activeZone) {
      if (this.activeZone.type !== 'placeholder') {
        EventBus.emit(GameEvents.INTERACTION, { type: this.activeZone.type });
      }
    }

}

private getNearbyZone(tileX: number, tileY: number): InteractionZone | null {
// Check if player tile OR any adjacent tile (1 step) overlaps a zone
const candidates = [
{ x: tileX, y: tileY },
{ x: tileX, y: tileY - 1 }, // Facing up: interact with tile above
];

    for (const zone of INTERACTION_ZONES) {
      for (const c of candidates) {
        if (zone.tiles.some(t => t.x === c.x && t.y === c.y)) {
          return zone;
        }
      }
    }
    return null;

}
}`}</Code>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
performance: () => (

  <div>
    <Box title="Rendering Optimizations" accent="#58a6ff">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2" }}>
        <p>• <strong style={{ color: "#58a6ff" }}>Static layers are renderTexture-baked.</strong> The Ground and Details layers never change. Bake them into a single RenderTexture once on scene create. This reduces draw calls from N tiles to 1.</p>
        <p>• <strong style={{ color: "#58a6ff" }}>Depth sorting on Overhead layer.</strong> Set depth based on Y position for all sprites: <code>sprite.setDepth(sprite.y)</code>. The Overhead layer gets depth 9999. This gives correct occlusion without a full scene sort.</p>
        <p>• <strong style={{ color: "#58a6ff" }}>Camera culls tiles automatically.</strong> Phaser's tilemap renderer only processes visible tiles. With a 20×15 map, this is a non-issue, but good to know for larger maps.</p>
      </div>
    </Box>

    <Box title="Network Optimizations" accent="#3fb950">
      <Code lang="typescript">{`// Optimizations by message type:

// PLAYER_MOVE: Throttled to 20/sec (see MovementThrottle)
// Only send delta if position actually changed
class MovementThrottle {
private lastSentState: string = '';

push(pos: PlayerPosition): void {
const key = \`\${pos.x},\${pos.y},\${pos.direction}\`;
if (key === this.lastSentState) return; // No-op if no change
this.lastSentState = key;
// ... proceed with throttled send
}
}

// CHAT: No buffering needed, low frequency

// ROOM_STATE: Sent once on join only

// Bandwidth math (worst case):
// 20 players × 20 moves/sec × ~50 bytes/msg = 20KB/s server outbound
// Easily within Vercel limits`}</Code>
</Box>

    <Box title="React Performance" accent="#d2a8ff">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2" }}>
        <p>• Phaser game is inside a single <code>div</code> ref — React never re-renders the canvas container.</p>
        <p>• Portfolio panels are lazy-loaded: <code>dynamic(() =&gt; import('./panels/AboutPanel'))</code>. They don't load until needed.</p>
        <p>• Use Zustand (not Context) for game UI state. Zustand doesn't cause tree-wide re-renders.</p>
        <p>• The EventBus uses Phaser's EventEmitter, not React state. Cross-boundary events never trigger renders.</p>
      </div>
    </Box>

    <Box title="Asset Loading" accent="#f78166">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2" }}>
        <p>• Serve all assets from <code>/public/assets/</code> — Vercel CDN caches them at edge.</p>
        <p>• Tileset PNG: target under 100KB. With 16×16 tiles and a limited palette, this is easy.</p>
        <p>• Use a BootScene with a loading bar. Never skip this — it prevents Phaser errors from missing textures.</p>
        <p>• Spritesheet: pack all player animations into one PNG. One texture atlas = one GPU upload.</p>
      </div>
    </Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
deployment: () => (

  <div>
    <Warn>Vercel Serverless Functions time out after 10-30s. WebSockets require a persistent process. Use Vercel's Node.js runtime via a custom server — NOT edge runtime or API routes.</Warn>

    <Box title="Custom Server Setup for Vercel" accent="#58a6ff">
      <Code lang="json">{`// package.json — override the start command

{
"scripts": {
"dev": "node server.js",
"build": "next build",
"start": "node server.js"
}
}`}</Code>
      <Code lang="json">{`// vercel.json
{
"buildCommand": "npm run build",
"outputDirectory": ".next",
"rewrites": [
{ "source": "/(.*)", "destination": "/" }
]
}`}</Code>
</Box>

    <Box title="Environment Variables" accent="#3fb950">
      <Code lang="bash">{`# .env.local

NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Vercel production (set in Vercel dashboard)

NEXT_PUBLIC_WS_URL=wss://your-domain.vercel.app`}</Code>
      <Code lang="typescript">{`// game/managers/WebSocketManager.ts
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3000';

export class WebSocketManager {
private ws: WebSocket | null = null;
private reconnectAttempts = 0;
private readonly MAX_RECONNECTS = 5;

connect(onMessage: (msg: ServerMessage) => void): void {
this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('[WS] Connected');
    };

    this.ws.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); }
      catch { console.warn('[WS] Parse error', e.data); }
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.MAX_RECONNECTS) {
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        setTimeout(() => { this.reconnectAttempts++; this.connect(onMessage); }, delay);
      }
    };

}

send(msg: ClientMessage): void {
if (this.ws?.readyState === WebSocket.OPEN) {
this.ws.send(JSON.stringify(msg));
}
}
}`}</Code>
</Box>

    <Box title="Vercel Limitations to Know" accent="#f78166">
      <div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2" }}>
        <p>• <strong style={{ color: "#f78166" }}>No persistent memory across restarts.</strong> If Vercel cold-starts your function, all player state is wiped. This is acceptable for a portfolio — players simply reconnect.</p>
        <p>• <strong style={{ color: "#f78166" }}>WebSocket connections close on function timeout.</strong> On Vercel Pro, functions can run for up to 800s. Standard plan: 60s. Implement client-side PING every 30s to keep connections alive.</p>
        <p>• <strong style={{ color: "#f78166" }}>Single region by default.</strong> Vercel deploys to one region for WebSockets (no WS multi-region). Pick <code>iad1</code> (US East) for lowest average global latency.</p>
      </div>
    </Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
security: () => (

  <div>
    <Box title="Rate Limiter" accent="#f78166">
      <Code lang="typescript">{`// server/rateLimit.ts
interface Bucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
private buckets = new Map<string, Bucket>();

// Token bucket: 30 tokens, refills 30/sec
private readonly MAX_TOKENS = 30;
private readonly REFILL_RATE = 30; // per second

check(socketId: string): boolean {
const now = Date.now();
let bucket = this.buckets.get(socketId);

    if (!bucket) {
      bucket = { tokens: this.MAX_TOKENS, lastRefill: now };
      this.buckets.set(socketId, bucket);
    }

    // Refill tokens based on elapsed time
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(this.MAX_TOKENS, bucket.tokens + elapsed * this.REFILL_RATE);
    bucket.lastRefill = now;

    if (bucket.tokens < 1) return false; // Rate limited

    bucket.tokens -= 1;
    return true;

}

cleanup(socketId: string): void {
this.buckets.delete(socketId);
}
}`}</Code>
</Box>

    <Box title="Input Sanitization" accent="#3fb950">
      <Code lang="typescript">{`// server/wsServer.ts — sanitize all incoming data

function sanitizeUsername(raw: unknown): string {
if (typeof raw !== 'string') return 'Visitor';
return raw
.trim()
.slice(0, 16)
.replace(/[<>&"']/g, '') // Strip HTML special chars
.replace(/[^\\w\\s\\-_.]/g, '') // Allow: alphanumeric, spaces, - \_ .
|| 'Visitor';
}

function sanitizeMessage(raw: unknown): string | null {
if (typeof raw !== 'string') return null;
const cleaned = raw.trim().slice(0, 100).replace(/[<>&"']/g, '');
return cleaned.length > 0 ? cleaned : null;
}

function sanitizePosition(raw: unknown): Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'> | null {
if (!raw || typeof raw !== 'object') return null;
const { x, y, direction, isMoving } = raw as Record<string, unknown>;

if (typeof x !== 'number' || typeof y !== 'number') return null;
if (!['up', 'down', 'left', 'right'].includes(String(direction))) return null;

// Clamp to map bounds (20×15 tiles)
return {
x: Math.max(0, Math.min(19, Math.round(x))),
y: Math.max(0, Math.min(14, Math.round(y))),
direction: direction as PlayerState['direction'],
isMoving: Boolean(isMoving),
};
}`}</Code>
</Box>

    <Box title="Connection Limits" accent="#d2a8ff">
      <Code lang="typescript">{`// server/wsServer.ts

const MAX_CONNECTIONS = 50; // Prevent server overload

wss.on('connection', (ws) => {
if (wss.clients.size > MAX_CONNECTIONS) {
ws.send(JSON.stringify({ type: 'ERROR', payload: { code: 'FULL', message: 'Server is full' } }));
ws.close();
return;
}
// ... handle connection
});`}</Code>
<div style={{ color: "#c9d1d9", fontSize: "13px", lineHeight: "2", marginTop: "12px" }}>
<p>Additional mitigations: <strong>IP-based connection rate limiting</strong> (max 3 connections per IP via <code>req.socket.remoteAddress</code>), <strong>payload size limit</strong> (reject messages &gt; 512 bytes), <strong>must JOIN before any other message</strong> (prevents state pollution from rogue clients).</p>
</div>
</Box>

  </div>
),

// ─────────────────────────────────────────────────────────────────────────────
roadmap: () => (

  <div>
    <Box title="Phase 1 — Static World (3-5 days)" accent="#3fb950">
      <Code lang="text">{`[ ] Bootstrap Next.js project with TypeScript
[ ] Install and configure Phaser with pixelArt mode
[ ] Create PhaserGame component with dynamic import
[ ] Implement BootScene + GameScene skeleton
[ ] Create Littleroot map in Tiled (20×15 tiles)
    → Ground layer, tree borders, paths, houses, lab
[ ] Load tilemap in Phaser, verify rendering
[ ] Implement CollisionLayer from tile properties
[ ] Implement LocalPlayer with grid-based movement
[ ] Camera follow, world bounds
[ ] Verify pixel-perfect rendering at 2x scale`}</Code>
    </Box>

    <Box title="Phase 2 — Interaction System (2-3 days)" accent="#58a6ff">
      <Code lang="text">{`[ ] Define InteractionZones for all buildings

[ ] Implement InteractionManager (E-key, proximity hint)
[ ] Implement EventBus (Phaser→React bridge)
[ ] Create Zustand store for active panel state
[ ] Build placeholder panels (About, Projects, Contact, Career)
[ ] Wire EventBus INTERACTION event → panel open
[ ] Add ESC key to close panels
[ ] Test all interactions end-to-end`}</Code>
</Box>

    <Box title="Phase 3 — Multiplayer (3-4 days)" accent="#d2a8ff">
      <Code lang="text">{`[ ] Implement custom server.js with WebSocket bootstrap

[ ] Implement WS protocol types (shared types file)
[ ] Implement RoomManager on server
[ ] Implement RateLimiter
[ ] Implement WebSocketManager on client
[ ] Implement PlayerStateManager
[ ] Implement RemotePlayer with interpolation
[ ] Implement MovementThrottle
[ ] Implement username flow (modal → JOIN message)
[ ] Test with 2+ browser tabs simultaneously
[ ] Verify player disappears on tab close`}</Code>
</Box>

    <Box title="Phase 4 — Chat System (1-2 days)" accent="#f78166">
      <Code lang="text">{`[ ] Implement ChatBubbleManager (Phaser Graphics + Text)

[ ] Implement ChatInput React component (ENTER key)
[ ] Wire CHAT_SENT event from React → WebSocketManager
[ ] Wire CHAT server message → ChatBubbleManager.show()
[ ] Test bubble positioning with moving players
[ ] Add bubble fade animation
[ ] Sanitize messages on server`}</Code>
</Box>

    <Box title="Phase 5 — Polish + Deploy (2-3 days)" accent="#e3b341">
      <Code lang="text">{`[ ] Pixel art assets: finalize sprites, tileset

[ ] Player animation: walking frames per direction
[ ] Portfolio panels: fill with real content
[ ] Loading screen / BootScene progress bar
[ ] Add PING/PONG latency monitoring
[ ] Exponential backoff reconnect in WebSocketManager
[ ] Set up Vercel project + env variables
[ ] Configure vercel.json for custom server
[ ] Deploy and test WebSocket connections on Vercel
[ ] Fix any CDN/CORS issues with asset loading
[ ] Test on mobile (touch controls optional but nice)`}</Code>
</Box>

    <Box title="Optional Enhancements" accent="#8b949e">
      <Code lang="text">{`[ ] Mobile joystick (Phaser virtual joystick plugin)

[ ] Player sprite customization (color variants)
[ ] Persistent username in localStorage
[ ] Sound effects (footsteps, interaction chime)
[ ] Day/night cycle (Phaser camera tint based on system time)
[ ] NPC sprite in the lab (fixed, no AI)
[ ] Analytics: count unique visitors via edge middleware`}</Code>
</Box>

    <Info>Total estimate: <strong>11-17 days</strong> for a senior developer working in focused sessions. The map design and pixel art assets are the biggest wildcard — budget extra time there if you're creating them from scratch.</Info>

  </div>
),

};

// ─────────────────────────────────────────────────────────────────────────────
// SHELL
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
const [active, setActive] = useState("architecture");

const content = sections_content[active];

return (
<div style={{
      minHeight: "100vh",
      background: "#0d1117",
      color: "#c9d1d9",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex",
      fontSize: "14px",
    }}>
{/_ Sidebar _/}
<div style={{
        width: "220px",
        minWidth: "220px",
        background: "#161b22",
        borderRight: "1px solid #30363d",
        padding: "20px 0",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
<div style={{ padding: "0 16px 20px", borderBottom: "1px solid #30363d", marginBottom: "8px" }}>
<div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#7d8590", textTransform: "uppercase", marginBottom: "4px" }}>Architecture Plan</div>
<div style={{ color: "#58a6ff", fontWeight: "700", fontSize: "13px" }}>Pokémon Portfolio</div>
</div>
{sections.map(s => (
<button
key={s.id}
onClick={() => setActive(s.id)}
style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: active === s.id ? "#21262d" : "transparent",
              border: "none",
              borderLeft: active === s.id ? "2px solid #58a6ff" : "2px solid transparent",
              color: active === s.id ? "#e6edf3" : "#7d8590",
              padding: "8px 16px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.1s",
            }} >
{s.label}
</button>
))}
</div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 40px", maxWidth: "860px", overflowY: "auto" }}>
        <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #30363d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: "22px", color: "#e6edf3", fontWeight: "700" }}>
              {sections.find(s => s.id === active)?.label}
            </h1>
            <Tag color="#58a6ff">Next.js</Tag>
            <Tag color="#3fb950">Phaser</Tag>
            <Tag color="#d2a8ff">WebSockets</Tag>
            <Tag color="#f78166">TypeScript</Tag>
          </div>
        </div>

        <div key={active}>
          {content ? content() : <p style={{ color: "#7d8590" }}>Select a section.</p>}
        </div>
      </div>
    </div>

);
}
```
