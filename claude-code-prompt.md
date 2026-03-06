# Claude Code Prompt — Pokémon Emerald Developer Portfolio
---

## PROMPT

---

You are building a production-grade multiplayer developer portfolio inspired by Pokémon Emerald (GBA). This is a real engineering project — not a demo. You have access to the full filesystem. Build everything from scratch unless a file already exists; in that case, read it first and extend it.

Before writing any code, run `ls` and `cat` the existing files to understand what is already present. Read the architecture guide if it exists. Do not assume anything about what has already been created.

---

## PROJECT CONTEXT

**Tech stack:**
- Next.js 14+ (App Router)
- React 18
- TypeScript (strict mode)
- Phaser 3 (game engine — client-side only, never SSR)
- Tailwind CSS (for all React/HTML UI — never inline styles on React components)
- Zustand (UI state management)
- `ws` library (WebSocket server)
- Custom `server.js` (bootstraps WS alongside Next.js HTTP)
- Deploys on Vercel

**Existing assets (already in `/public/assets/sprites/`):**
- `grass.png` — 1×1 tile (16×16px), the ground tile
- `house.png` — sprite sheet tile, 6 tiles wide × 5 tiles tall (each tile 16×16px = 96×80px total)
- `tree.png` — sprite, 3 tiles wide × 3 tiles tall (48×48px total)

No other assets exist. You must generate everything else programmatically (using Phaser Graphics API to draw colored rectangles/shapes) for:
- Paths (light brown/tan colored tiles drawn with Phaser Graphics)
- Mailbox (small colored rectangle sprite)
- Lab building (larger colored rectangle with a distinct color)
- Player sprite (simple colored rectangle with a direction indicator)
- Water/decorative tiles if needed

**Map design:**
- Inspired by Littleroot Town from Pokémon Emerald
- 20 tiles wide × 15 tiles tall (320×240px internal resolution)
- Scaled 2× to 640×480px viewport
- Border: 2-tile-thick ring of trees (use tree.png)
- Interior: grass base (use grass.png tiled)
- Paths: cross-shaped dirt paths connecting buildings
- Buildings placed inside the tree border:
  - Player's house: top-left interior area (tile 3,4) — use house.png — opens "About Me" panel
  - Neighbor's house: top-right interior area (tile 13,4) — use house.png — placeholder
  - Lab: bottom-center interior area (tile 8,10) — programmatically drawn (wider building) — opens "Projects" panel
  - Mailbox: next to player's house (tile 6,8) — programmatically drawn — opens "Contact" panel
- North path gap: 2-tile gap in the top tree border (tiles 9,0 and 10,0) — triggers "Career" panel

---

## WHAT TO BUILD — COMPLETE FILE LIST

Build every file listed below. Do not skip any. After creating each major section, run the dev server briefly to check for TypeScript/import errors before continuing.

### 1. Project Configuration

**`package.json`** — add/verify these dependencies:
```
phaser, ws, @types/ws, zustand
```
Run `npm install` after updating.

**`next.config.ts`** — configure:
- `experimental.serverComponentsExternalPackages: ['ws']`
- Webpack: mark `phaser` as external for SSR (it must never be server-bundled)
- Add `transpilePackages` if needed

**`tailwind.config.ts`** — ensure content paths include `./app/**` and `./components/**`

**`tsconfig.json`** — verify `strict: true`, path alias `@/*` maps to `./`

**`server.js`** (root) — Custom Node.js server:
- Creates HTTP server
- Attaches Next.js request handler
- Attaches WebSocket server (`ws` library) on the same port
- Imports and uses `RoomManager` and `RateLimiter` from `./server/`
- Handles all WS message routing: JOIN, PLAYER_MOVE, CHAT, PING
- Must JOIN before any other message is accepted
- Listens on `process.env.PORT || 3000`

### 2. Shared Types

**`types/ws-protocol.ts`** — exported shared types:
```typescript
interface PlayerState {
  id: string
  username: string
  x: number        // tile X
  y: number        // tile Y
  direction: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean
}

type ClientMessage =
  | { type: 'JOIN';        payload: { username: string } }
  | { type: 'PLAYER_MOVE'; payload: Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'> }
  | { type: 'CHAT';        payload: { message: string } }
  | { type: 'PING';        payload: { t: number } }

type ServerMessage =
  | { type: 'ROOM_STATE';   payload: { players: PlayerState[]; yourId: string } }
  | { type: 'PLAYER_JOIN';  payload: PlayerState }
  | { type: 'PLAYER_MOVE';  payload: Pick<PlayerState, 'id' | 'x' | 'y' | 'direction' | 'isMoving'> }
  | { type: 'PLAYER_LEAVE'; payload: { id: string } }
  | { type: 'CHAT';         payload: { id: string; message: string } }
  | { type: 'PONG';         payload: { t: number; serverT: number } }
  | { type: 'ERROR';        payload: { code: string; message: string } }
```

### 3. Server Layer (`server/`)

**`server/roomManager.ts`**:
- `Map<socketId, PlayerState>` for player state
- `Map<socketId, WebSocket>` for connections
- Methods: `join(socketId, ws, username)`, `move(socketId, pos)`, `broadcast_chat(socketId, message)`, `leave(socketId)`, `getRoomState(socketId)`
- `join` sends `ROOM_STATE` to new joiner, broadcasts `PLAYER_JOIN` to others
- `move` does a sanity check: max delta of 3 tiles per update; clamps x to [0,19], y to [0,14]
- `broadcast_chat` relays `CHAT` to all clients including sender
- `leave` removes player and broadcasts `PLAYER_LEAVE`
- Spawn position: x=10, y=7 (center of map)

**`server/rateLimit.ts`**:
- Token bucket algorithm
- 30 tokens max, refills 30/sec
- `check(socketId): boolean`
- `cleanup(socketId): void`

### 4. Zustand Store

**`store/gameStore.ts`**:
```typescript
type PanelType = 'about' | 'projects' | 'contact' | 'career' | null

interface GameStore {
  activePanel: PanelType
  username: string
  isUsernameSet: boolean
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  setUsername: (name: string) => void
}
```
Use `create` from zustand. Export as `useGameStore`.

### 5. Game Engine (`game/`)

**`game/EventBus.ts`**:
- `export const EventBus = new Phaser.Events.EventEmitter()`
- `export const GameEvents = { INTERACTION, CHAT_SENT, SCENE_READY, USERNAME_SET } as const`

**`game/constants.ts`**:
```typescript
export const TILE_SIZE = 16
export const MAP_WIDTH = 20
export const MAP_HEIGHT = 15
export const MOVE_DURATION_MS = 180
export const SPAWN_TILE_X = 10
export const SPAWN_TILE_Y = 7
export const EMIT_INTERVAL_MS = 50
export const INTERPOLATION_BUFFER = 2
```

**`game/map/collisionData.ts`**:
Hard-code the collision grid as a 15×20 array of 0s and 1s based on the map layout described above:
- 1 = blocked (trees on border rows/cols, house walls, lab walls)
- 0 = walkable (paths, grass interior, house doors, north path gap)
- The house "footprint" tiles are blocked EXCEPT the bottom-center door tile
- The north gap (x=9,10 at y=0,1) must be 0 (walkable)

Export as: `export const COLLISION_MAP: number[][] = [...]`

**`game/map/interactionZones.ts`**:
```typescript
export interface InteractionZone {
  id: string
  type: 'about' | 'projects' | 'contact' | 'career' | 'placeholder'
  label: string
  tiles: Array<{ x: number; y: number }>
}

export const INTERACTION_ZONES: InteractionZone[] = [
  // Player house door area
  { id: 'house-main', type: 'about', label: 'Home [E]', tiles: [{x:4,y:8},{x:5,y:8}] },
  // Neighbor house door
  { id: 'house-neighbor', type: 'placeholder', label: '??? [E]', tiles: [{x:14,y:8},{x:15,y:8}] },
  // Lab door
  { id: 'lab', type: 'projects', label: 'Lab [E]', tiles: [{x:9,y:12},{x:10,y:12}] },
  // Mailbox
  { id: 'mailbox', type: 'contact', label: 'Mailbox [E]', tiles: [{x:6,y:9}] },
  // North path exit
  { id: 'north-path', type: 'career', label: 'Route 101 [E]', tiles: [{x:9,y:0},{x:10,y:0},{x:9,y:1},{x:10,y:1}] },
]
```

**`game/managers/WebSocketManager.ts`**:
- Reads `process.env.NEXT_PUBLIC_WS_URL` with fallback to `ws://localhost:3000`
- `connect(onMessage)` method — opens WS, sets up handlers
- `send(msg: ClientMessage)` — only sends if `ws.readyState === WebSocket.OPEN`
- Exponential backoff reconnect (max 5 attempts, caps at 30s)
- `startPing()` — sends PING every 30s to keep connection alive
- `disconnect()` — cleans up

**`game/managers/MovementThrottle.ts`**:
- Token drain: emits at most once per `EMIT_INTERVAL_MS`
- Deduplication: skip emit if x/y/direction haven't changed
- `push(position)` — queues a new position
- `tick()` — called every Phaser update frame; flushes if interval elapsed

**`game/managers/ChatBubbleManager.ts`**:
- `show({ id, sprite, message })` — creates a Phaser Container with:
  - White rounded rectangle background (Phaser Graphics, fillRoundedRect)
  - Black text (7px, word wrap 80px)
  - Small triangle "tail" pointing down
  - Fade in over 150ms
  - Auto-dismiss after 4000ms with 500ms fade out
- `update()` — reposition all active bubbles above their target sprites each frame
- `dismiss(id)` — fade out and destroy
- `destroy()` — clean up all bubbles and event listeners
- Bubbles are anchored 24px above the sprite center

**`game/managers/InteractionManager.ts`**:
- E key via `Phaser.Input.Keyboard.KeyCodes.E`
- `update(playerTileX, playerTileY)` — checks proximity to interaction zones
- Checks current tile AND tile directly in front of player (based on direction)
- Shows/hides hint text (Phaser Text object, depth 40, small dark background)
- On `JustDown(E)`: fires `EventBus.emit(GameEvents.INTERACTION, { type })`
- Placeholder zones show the hint but do nothing on press

**`game/managers/PlayerStateManager.ts`**:
- `Map<string, RemotePlayer>`
- `handleServerMessage(msg: ServerMessage)` — routes to add/update/remove/chat
- `addPlayer(state)` — creates RemotePlayer instance
- `removePlayer(id)` — calls destroy, removes from map
- `update(delta)` — calls update on all remote players
- `destroy()` — cleans up everything

**`game/entities/LocalPlayer.ts`**:

This is the most important class. Implement carefully:

- Takes `(scene: Phaser.Scene, ws: WebSocketManager, tileX: number, tileY: number)`
- Creates a Phaser.GameObjects.Sprite at pixel position `(tileX * TILE_SIZE + 8, tileY * TILE_SIZE + 8)`
- If `player.png` spritesheet exists: use it. Otherwise: draw a programmatic sprite using Phaser Graphics:
  - 14×14px colored rectangle (green fill, dark border)
  - A small directional indicator triangle on the facing side
  - Use `scene.add.graphics()` and `generateTexture('player-gen', 16, 16)` then `scene.add.sprite(..., 'player-gen')`
- `isMoving: boolean` — grid-locked movement (blocks new input while tweening)
- `direction` property
- `update(collisionMap)` — reads cursor keys and WASD
  - If not moving: check input, pick direction
  - Check `collisionMap[nextY][nextX]` — if blocked, only update facing direction, no move
  - If walkable: set `isMoving = true`, start a `scene.tweens.add` for MOVE_DURATION_MS
  - On tween complete: set `isMoving = false`, emit throttled position
  - While moving: update throttle tick only
- Camera follows this sprite with `startFollow(sprite, true, 0.08, 0.08)`
- `tileX`, `tileY` are kept in sync (tile coordinates, not pixel)
- `direction` is updated on every directional keypress even if blocked (face the wall)
- Public getters: `getTileX()`, `getTileY()`, `getDirection()`, `getPixelX()`, `getPixelY()`

**`game/entities/RemotePlayer.ts`**:
- Takes `(scene: Phaser.Scene, state: PlayerState)`
- Sprite: reuse the same programmatic player texture but tinted blue (`setTint(0x88aaff)`)
- Nametag: `scene.add.text` at depth 20, 8px, white with black stroke
- Position buffer: `PositionSnapshot[]` with max size 5
- `enqueuePosition(pos)` — pushes to buffer
- `update(delta)` — if not currently tweening AND buffer has >= INTERPOLATION_BUFFER entries, dequeue next target, tween toward it. If distance > 5 tiles, snap instead.
- `showChat(message)` — emits `show-chat-bubble` on scene events
- `destroy()` — stop tween, destroy sprite and nametag

**`game/scenes/BootScene.ts`**:
- Preloads: `grass` image, `house` spritesheet (frameWidth: 16, frameHeight: 16), `tree` image
- Generates programmatic textures for: `path`, `player-gen`, `remote-player-gen`, `mailbox`, `lab-tile`
  - `path`: 16×16 tan/brown rectangle
  - `player-gen`: 16×16 green rectangle with direction dot (default down)
  - `mailbox`: 8×12 red-brown post box shape
  - `lab-tile`: 16×16 gray-blue tile
- Shows a simple loading bar (white rectangle on black background)
- On complete: starts `GameScene`

**`game/scenes/GameScene.ts`**:

This is the main scene. Build it in this order:

1. **Map rendering** — no Tiled JSON; draw the map programmatically:
   - Fill entire 20×15 grid with `grass` image tiles
   - Draw border trees: all tiles where `x < 2 || x >= 18 || y < 2 || y >= 13` → place `tree` image (scaled/tiled to fit 16×16 per tile, or placed at 3×3 tile intervals)
   - Draw north gap: at x=9,10 y=0,1: place grass (no tree)
   - Draw paths: horizontal path at y=9 (x=2 to x=17), vertical path at x=9,10 (y=2 to y=12) — use `path` texture
   - Draw player house at tile (3,4): place house sprite (it's 6×5 tiles = 96×80px, position at tile 3,4 pixel origin)
   - Draw neighbor house at tile (13,4): same
   - Draw lab: draw a 4×3 tile programmatic building at (8,10) using Graphics (gray-blue color)
   - Draw mailbox at tile (6,8) using `mailbox` texture
   - All static map graphics go into a RenderTexture for performance (bake once in create)

2. **Collision** — import `COLLISION_MAP` from `game/map/collisionData.ts`

3. **Player spawn** — create `LocalPlayer` at spawn tile, pass collision map

4. **Managers** — instantiate: `WebSocketManager`, `PlayerStateManager`, `ChatBubbleManager`, `InteractionManager`, `MovementThrottle`

5. **WS connect** — call `ws.connect()` in `create()`. On `SCENE_READY` emit from EventBus, send JOIN with username from `useGameStore.getState().username`

6. **EventBus listeners** — in `create()`:
   - `GameEvents.CHAT_SENT` → `ws.send({ type: 'CHAT', payload: { message } })`
   - `GameEvents.USERNAME_SET` → send JOIN if not yet joined

7. **`update(time, delta)`** method:
   - `localPlayer.update(COLLISION_MAP)`
   - `interactionManager.update(localPlayer.getTileX(), localPlayer.getTileY(), localPlayer.getDirection())`
   - `playerStateManager.update(delta)`
   - `chatBubbleManager.update()`
   - `movementThrottle.tick()`

8. **Depth sorting** — player sprite depth = `sprite.y` (set each frame). Remote players same. Static map is depth 0. Overhead elements (tree tops) depth 50.

9. **Camera** — world bounds = 320×240. Camera viewport = game canvas size.

**`game/scenes/UIScene.ts`**:
- Runs in parallel with GameScene (add to scene list after GameScene)
- This scene is intentionally minimal — just a placeholder for future HUD elements
- It should NOT duplicate chat bubbles or name tags (those are in GameScene)

### 6. React Components (`components/`)

**`components/PhaserGame.tsx`** — `'use client'`:
- `useRef<HTMLDivElement>` for container
- `useRef<Phaser.Game>` for game instance
- `useEffect` — async import Phaser + scenes, create `new Phaser.Game(config)`
- Config:
  ```typescript
  {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    parent: containerRef.current,
    backgroundColor: '#1a472a',
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: [BootScene, GameScene, UIScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  }
  ```
- Cleanup: `game.destroy(true)` on unmount
- Styling: `w-full h-full` with `imageRendering: pixelated` inline (this one inline style is acceptable because Tailwind has no pixelated class)
- Listen to `GameEvents.INTERACTION` on EventBus, call `useGameStore.getState().openPanel(type)`

**`components/UsernameModal.tsx`** — `'use client'`:
- Shown when `!isUsernameSet`
- Tailwind: dark overlay, centered card with pixel-art aesthetic
- Input for username (max 16 chars, alphanumeric + spaces only)
- On submit: `setUsername(name)`, emit `GameEvents.USERNAME_SET`
- Prevent empty submission
- Style it like a Pokémon dialog box: dark border, pixelated font (use Google Fonts `Press Start 2P` or fallback to monospace), white background

**`components/ChatInput.tsx`** — `'use client'`:
- Fixed bottom-left position (`fixed bottom-4 left-4`)
- When closed: shows "ENTER to chat" hint text (small, semi-transparent)
- When open: input field + Send button
- ENTER key opens (global keydown listener, only when no modal is open)
- ESC key closes and clears
- On send: `EventBus.emit(GameEvents.CHAT_SENT, value.trim())`; close input
- Max 100 chars
- Tailwind styling: dark/translucent, matches game aesthetic

**`components/HUD.tsx`** — `'use client'`:
- Fixed top-left: shows current username
- Fixed top-right: shows "🟢 Online" and player count (future: read from store)
- Small, semi-transparent, pixel-art font style
- Tailwind classes only

**`components/panels/PanelBase.tsx`**:
- Reusable panel wrapper
- Props: `title: string`, `onClose: () => void`, `children: React.ReactNode`
- Fixed overlay: `fixed inset-0 z-50 flex items-center justify-center`
- Dark backdrop with click-to-close
- Panel card: max-w-2xl, styled like a Pokémon menu (dark border, pixel corners)
- ESC key also closes
- Tailwind only

**`components/panels/AboutPanel.tsx`**:
- Uses `PanelBase`
- Content: placeholder "About Me" section with:
  - Name/title
  - Short bio paragraph
  - Skills list (Frontend, Backend, Tools)
  - A "→ See my projects in the Lab!" CTA button that closes and opens projects panel

**`components/panels/ProjectsPanel.tsx`**:
- Uses `PanelBase`
- Content: 3 placeholder project cards
- Each card: title, description, tech stack tags, GitHub/Demo links (placeholder `#`)
- Grid layout (2 cols on desktop, 1 on mobile)

**`components/panels/ContactPanel.tsx`**:
- Uses `PanelBase`
- Content: email, GitHub, LinkedIn (all placeholder values)
- Simple list with icons (use Unicode symbols, no icon library needed)

**`components/panels/CareerPanel.tsx`**:
- Uses `PanelBase`
- Content: timeline of 2-3 placeholder work experiences
- Styled as a vertical timeline

### 7. App Router (`app/`)

**`app/layout.tsx`**:
- Root layout
- Import `Press Start 2P` from Google Fonts (for pixel aesthetic) — use `next/font/google`
- Apply to `<html>` as a CSS variable
- Dark background on body
- Tailwind base styles
- Metadata: title "< your name >.dev", description

**`app/page.tsx`** — `'use client'`:
- Import `PhaserGame` with `dynamic(..., { ssr: false, loading: () => <LoadingScreen /> })`
- Import all panels
- Import `useGameStore`
- Full viewport layout: `w-screen h-screen bg-black relative overflow-hidden`
- Render:
  - `<PhaserGame />` filling the entire space
  - `<UsernameModal />` (conditional on `!isUsernameSet`)
  - `<HUD />` (always visible)
  - `<ChatInput />` (always visible)
  - Panel modals (conditional on `activePanel`)
- A simple `LoadingScreen` component (inline or separate): black background, centered "Loading..." in pixel font

**`app/globals.css`**:
- Tailwind directives
- CSS variable for pixel font: `--font-pixel`
- `canvas { image-rendering: pixelated; }`
- Scrollbar hiding for panels
- Any custom pixel-border utility classes needed

### 8. Environment

**`.env.local`**:
```
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

**`.env.example`**:
```
NEXT_PUBLIC_WS_URL=ws://localhost:3000
# Production: NEXT_PUBLIC_WS_URL=wss://your-domain.vercel.app
```

---

## ASSET HANDLING RULES

Since you only have `grass.png`, `house.png`, and `tree.png`:

**grass.png** (1×1 tile = 16×16px):
- Tile the entire map floor using `scene.add.tileSprite` or manually place in grid

**house.png** (6 tiles wide × 5 tiles tall = 96×80px):
- Load as a single image (not a spritesheet)
- Place at the correct pixel origin: `tile_x * 16, tile_y * 16`
- Scale: 1× (native pixel art scale, already 16px tiles)
- Two houses: player house at tile (3,4), neighbor house at tile (13,4)

**tree.png** (3×3 tiles = 48×48px):
- Place trees at every valid border position
- Align to tile grid: position at `Math.floor(x / 3) * 3` etc. to avoid overlap
- Trees fill the 2-tile border — overlap is fine visually, prioritize coverage

**Programmatic textures** (generate in BootScene using Phaser Graphics + `generateTexture`):
- `path-tile`: `#c4a265` 16×16 fill
- `lab-wall`: `#7090a0` 16×16 fill  
- `lab-roof`: `#405060` 16×16 fill
- `mailbox-sprite`: draw a 16×16 post box (red-brown body, gray post)
- `player-local`: green `#44aa44` 14×14 rect, centered in 16×16, with direction dot
- `player-remote`: blue `#4466aa` 14×14 rect, centered in 16×16

---

## COLLISION MAP SPECIFICATION

Generate the collision map for a 20×15 grid. Use this logic:
```
Row 0:    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  
Row 1:    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  
Row 2:    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
Row 3:    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]
Row 4:    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]
Row 5:    [1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1]  
Row 6:    [1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1]
Row 7:    [1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1]
Row 8:    [1,1,1,1,1,1,0,0,1,1,0,1,1,0,0,0,0,1,1,0,1,1,0,0,1,1,1,1,1,1]
Row 9:    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1] 
Row 10:   [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]
Row 11:   [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]
Row 12:   [1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]  
Row 13:   [1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]
Row 14:   [1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]  
Row 15:   [1,1,1,1,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]  
Row 16:   [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]  
Row 17:   [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]  
Row 18:   [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]  
Row 19:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  
Row 20:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
Row 21:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
```

The borders are 3x3 tree with the left and right having 2 trees
Export this exactly as shown.

---

## CODE QUALITY REQUIREMENTS

- **TypeScript strict mode** — no `any`, no `@ts-ignore`
- **No inline styles on React components** — use Tailwind exclusively (exception: `imageRendering: pixelated` on the canvas container, and `style` props where Tailwind cannot express the value)
- **All Phaser code** uses `import type` where possible to avoid pulling Phaser into SSR
- **EventBus** is the ONLY communication channel between Phaser and React
- **Phaser scenes** never import React hooks or components
- **React components** never import Phaser directly (only through dynamic import in PhaserGame.tsx)
- **server/** files are CommonJS (`require`/`module.exports`) — they run in Node.js, not bundled by webpack
- All magic numbers extracted to `game/constants.ts`
- Each file has a single, clear responsibility

---

## BUILD VERIFICATION STEPS

After completing all files, run these checks in order:

1. `npx tsc --noEmit` — must pass with zero errors
2. `npm run build` — must compile successfully
3. `node server.js` — server must start without errors
4. Open browser at `localhost:3000` — game must render
5. Open two tabs — both must see each other's player moving
6. Press E near a building — correct panel must open
7. Type a message — chat bubble must appear above player

If any step fails, fix it before reporting done.

---

## FINAL NOTES

- This is a portfolio project that real developers will visit. The code quality matters as much as the visuals.
- The map does not need to be beautiful — it needs to work correctly and feel like Pokémon Emerald in structure and movement.
- Player movement must feel snappy — MOVE_DURATION_MS = 180ms is intentional.
- Do not add features not listed here. Build what is specified, build it well.
- After each major section (server, game engine, React components), pause and check for TypeScript errors before continuing.
- If you encounter a dependency that's missing, install it and continue.
- When complete, provide a summary of: all files created, any deviations from spec and why, and the exact command to start the dev server.
