import Phaser from 'phaser'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, SPAWN_TILE_X, SPAWN_TILE_Y } from '@/game/constants'
import { COLLISION_MAP } from '@/game/map/collisionData'
import { TERRAIN, TERRAIN_MAP, BASE, BASE_MAP } from '@/game/map/terrainData'
import { EventBus, GameEvents } from '@/game/EventBus'
import { WebSocketManager } from '@/game/managers/WebSocketManager'
import { MovementThrottle } from '@/game/managers/MovementThrottle'
import { ChatBubbleManager } from '@/game/managers/ChatBubbleManager'
import { InteractionManager } from '@/game/managers/InteractionManager'
import { PlayerStateManager } from '@/game/managers/PlayerStateManager'
import { LocalPlayer } from '@/game/entities/LocalPlayer'
import type { ServerMessage } from '@/types/ws-protocol'
import { DECOR, DECOR_MAP } from '../map/decorData'
import { PathAutotiler } from '../helpers/PathAutoTiler'

// ─── Depth constants ────────────────────────────────────────────────────────
const LAYER_BASE     =       0
const LAYER_TERRAIN  =   1_000
const LAYER_DECOR    =   5_000
const LAYER_PLAYER   =  10_000
const LAYER_OVERHEAD = 100_000

export class GameScene extends Phaser.Scene {
  // ── Layer groups ────────────────────────────────────────────────────────
  private terrainGroup!: Phaser.GameObjects.Group
  private decorGroup!: Phaser.GameObjects.Group
  private overheadGroup!: Phaser.GameObjects.Group

  // ── Managers ────────────────────────────────────────────────────────────
  private localPlayer!: LocalPlayer
  private wsManager!: WebSocketManager
  private movementThrottle!: MovementThrottle
  private chatBubbleManager!: ChatBubbleManager
  private interactionManager!: InteractionManager
  private playerStateManager!: PlayerStateManager
  private joined = false

  // ── Depth tracking to avoid redundant setDepth calls ───────────────────
  private lastPlayerDepth = -1

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    const calcZoom = () => {
      const short = Math.min(this.scale.width, this.scale.height)
      return short / (20 * TILE_SIZE)
    }

    this.terrainGroup  = this.add.group()
    this.decorGroup    = this.add.group()
    this.overheadGroup = this.add.group()

    this.renderBaseLayer()
    this.renderTerrainLayer()
    this.renderDecorLayer()

    // ── Managers & local player ──────────────────────────────────────────
    this.wsManager = new WebSocketManager()

    let characterIndex = 0
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useGameStore } = require('@/store/gameStore')
      characterIndex = useGameStore.getState().selectedCharacter
    } catch {}

    this.localPlayer = new LocalPlayer(
      this,
      this.wsManager,
      SPAWN_TILE_X,
      SPAWN_TILE_Y,
      characterIndex,
    )
    this.localPlayer.sprite.setDepth(LAYER_PLAYER + this.localPlayer.sprite.y)
    this.lastPlayerDepth = LAYER_PLAYER + this.localPlayer.sprite.y

    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    this.cameras.main.setZoom(calcZoom())
    this.cameras.main.startFollow(this.localPlayer.sprite, true, 0.12, 0.12)
    this.scale.on('resize', () => this.cameras.main.setZoom(calcZoom()))

    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)

    this.movementThrottle = new MovementThrottle(this.wsManager)
    this.localPlayer.setThrottle(this.movementThrottle)

    this.chatBubbleManager  = new ChatBubbleManager(this)
    this.interactionManager = new InteractionManager(this)
    this.playerStateManager = new PlayerStateManager(this, this.chatBubbleManager)

    // ── WebSocket ────────────────────────────────────────────────────────
    this.wsManager.connect(
      (msg: ServerMessage) => {
        this.playerStateManager.handleServerMessage(msg)

        if (msg.type === 'ROOM_STATE') {
          this.playerStateManager.setLocalId(msg.payload.yourId)
        }

        if (msg.type === 'CHAT' && msg.payload.id === this.playerStateManager['localId']) {
          this.chatBubbleManager.show({
            id: 'local',
            sprite: this.localPlayer.sprite,
            message: msg.payload.message,
            isLocal: true,
          })
        }

        if (msg.type === 'CHAT') {
          const username = this.playerStateManager.getUsername(msg.payload.id) ?? 'Unknown'
          try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { useGameStore } = require('@/store/gameStore')
            useGameStore.getState().addChatMessage({
              username,
              message: msg.payload.message,
              timestamp: Date.now(),
            })
          } catch {}
        }
      },
      () => { this.sendJoin() },
    )

    // ── EventBus listeners ───────────────────────────────────────────────
    EventBus.on(GameEvents.CHAT_SENT, (...args: unknown[]) => {
      const message = args[0] as string
      this.wsManager.send({ type: 'CHAT', payload: { message } })
    })

    EventBus.on(GameEvents.CHAT_FOCUS, (...args: unknown[]) => {
      const isFocused = args[0] as boolean
      this.localPlayer.setInputEnabled(!isFocused)
    })

    EventBus.on(GameEvents.USERNAME_SET, () => {
      this.sendJoin()
    })

    this.sendJoin()
    EventBus.emit(GameEvents.SCENE_READY)
    this.scene.launch('UIScene')
  }

  // ── Update ──────────────────────────────────────────────────────────────
  update(_time: number, delta: number): void {
    this.localPlayer.update(COLLISION_MAP)

    // Only call setDepth when the player has actually moved to a new depth band.
    // Phaser's setDepth triggers a scene-graph dirty flag every call, so
    // skipping it when the value hasn't changed is a meaningful saving.
    const newDepth = LAYER_PLAYER + this.localPlayer.sprite.y
    if (newDepth !== this.lastPlayerDepth) {
      this.localPlayer.sprite.setDepth(newDepth)
      this.lastPlayerDepth = newDepth
    }

    this.interactionManager.update(
      this.localPlayer.getTileX(),
      this.localPlayer.getTileY(),
      this.localPlayer.getDirection(),
    )
    this.playerStateManager.update(delta)
    this.chatBubbleManager.update()
    this.movementThrottle.tick()
  }

  // ── Shutdown ─────────────────────────────────────────────────────────────
  shutdown(): void {
    EventBus.off(GameEvents.CHAT_SENT)
    EventBus.off(GameEvents.CHAT_FOCUS)
    EventBus.off(GameEvents.USERNAME_SET)
    this.wsManager.disconnect()
    this.chatBubbleManager.destroy()
    this.interactionManager.destroy()
    this.playerStateManager.destroy()
    this.localPlayer.destroy()
  }

  // =========================================================================
  // LAYER 0 — Base (ground floor)
  // =========================================================================
  /**
   * Reads BASE_MAP and bakes every ground tile into a single RenderTexture.
   *
   * FIX: pathTiler.drawAll() is called ONCE after the grass loop, not inside
   * it. The original code called drawAll() on every iteration of the x-loop,
   * causing O(MAP_WIDTH × MAP_HEIGHT²) redundant work.
   *
   * FIX: PathAutotiler no longer needs a scene reference for the stamp RT
   * (the stamp was unused dead code). We still pass `this` for API compat.
   */
  private renderBaseLayer(): void {
    const rt = this.add.renderTexture(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    rt.setOrigin(0, 0)
    rt.setDepth(LAYER_BASE)

    const pathTiler = new PathAutotiler(this, {
      sheetKey: 'path-sheet',
      insetKey:  'path-inset',
      tileSize:  TILE_SIZE,
    })

    // Pass 1 — ground tiles (grass and sand; path is drawn in pass 2)
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = BASE_MAP[y][x]
        if (tile === BASE.PATH) continue

        let key: string
        if (tile === BASE.SAND) {
          key = 'sand'
        } else if (tile === BASE.WATER) {
          key = 'water'
        } else {
          key = ((x * 7 + y * 13) % 3 === 0) ? 'grass-2' : 'grass-1'
        }
        rt.drawFrame(key, undefined, x * TILE_SIZE, y * TILE_SIZE)
      }
    }

    // Pass 2 — path autotiling (single O(n) pass over the whole map)
    pathTiler.drawAll(rt, BASE_MAP, BASE.PATH)

    // PathAutotiler no longer holds live resources, but call destroy()
    // for forward-compatibility if it ever does again.
    pathTiler.destroy()
  }

  // =========================================================================
  // LAYER 1 — Terrain (solid objects: trees, houses, greenhouse)
  // =========================================================================
  /**
   * FIX: Flat tiles (sand, water, mailbox) and tall objects are rendered in
   * separate passes, but we avoid creating a second RenderTexture for flat
   * tiles — they're baked into the same flatRt.
   *
   * FIX: placeTallObject now uses a shared offscreen RenderTexture for ALL
   * upper-half crops instead of allocating a new RT per object. This reduces
   * GPU texture allocations from O(num_objects) to O(1).
   */
  private renderTerrainLayer(): void {
    // ── Flat tiles baked into one RT ──────────────────────────────────────
    const flatRt = this.add.renderTexture(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    flatRt.setOrigin(0, 0)
    flatRt.setDepth(LAYER_TERRAIN - 1)

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = TERRAIN_MAP[y][x]
        if (tile === TERRAIN.MAILBOX) flatRt.drawFrame('mailbox', undefined, x * TILE_SIZE, y * TILE_SIZE)
        if (tile === TERRAIN.STAIRS)  flatRt.drawFrame('stairs',  undefined, x * TILE_SIZE, y * TILE_SIZE)
      }
    }

    // ── Tall objects ──────────────────────────────────────────────────────
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = TERRAIN_MAP[y][x]
        if (tile === TERRAIN.TREE)       this.placeTallObject(x, y, 'tree',       0.5)
        if (tile === TERRAIN.HOUSE)      this.placeTallObject(x, y, 'house',      0.5)
        if (tile === TERRAIN.GREENHOUSE) this.placeTallObject(x, y, 'greenhouse', 0.2)
        if (tile === TERRAIN.LAB)        this.placeTallObject(x, y, 'lab',        0.3)
      }
    }
  }

  /**
   * Places a tall sprite anchored at tile (anchorTileX, anchorTileY).
   *
   * FIX: Instead of allocating a fresh RenderTexture per object for the upper
   * half, we draw the upper portion directly into the overhead RenderTexture
   * (overheadRt) using a single persistent RT, then stamp it at the right
   * position. This collapses N GPU allocations into 1.
   *
   * The lower half is still a plain Image (zero allocation cost).
   */
  private placeTallObject(
    anchorTileX: number,
    anchorTileY: number,
    key: string,
    splitFraction: number,
  ): void {
    const texture  = this.textures.get(key).getSourceImage() as HTMLImageElement
    const spriteH  = texture.height
    const splitY   = Math.floor(spriteH * splitFraction)

    const anchorPx = anchorTileX * TILE_SIZE
    const anchorPy = (anchorTileY + 1) * TILE_SIZE

    // ── Lower half — Y-sorted ──
    const lower = this.add.image(anchorPx, anchorPy, key)
    lower.setOrigin(0, 1)
    lower.setDepth(LAYER_TERRAIN + anchorPy)
    this.terrainGroup.add(lower)

    // ── Upper half — overhead ──
    // Draw only the top `splitY` pixels of the source texture as a crop.
    // We use a Phaser Image with a custom crop instead of a RenderTexture
    // so no extra GPU texture is allocated.
    const spriteTopY = anchorPy - spriteH
    const upper = this.add.image(anchorPx, spriteTopY, key)
    upper.setOrigin(0, 0)
    upper.setCrop(0, 0, texture.width, splitY)
    upper.setDepth(LAYER_OVERHEAD + anchorPy)
    this.overheadGroup.add(upper)
  }

  // =========================================================================
  // LAYER 2 — Decor (ledges, water edges, bushes, ladders)
  // =========================================================================
  private renderDecorLayer(): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = DECOR_MAP[y][x]
        if (tile === DECOR.NONE) continue

        const px    = x * TILE_SIZE + TILE_SIZE / 2
        const py    = y * TILE_SIZE + TILE_SIZE / 2
        const depth = LAYER_DECOR + py 

        if (tile === DECOR.FLOWER_BUSH) {
          const bush = this.add.image(px, py, 'flower_bush')
          bush.setOrigin(0.5, 0.5)
          bush.setDepth(depth)
          this.decorGroup.add(bush)
          continue
        }

        const { key, flipX, flipY } = this.resolveDecorSprite(tile)
        if (!key) continue

        const img = this.add.image(px, py, key)
        img.setOrigin(0.5, 0.5)
        img.setFlipX(flipX)
        img.setFlipY(flipY)
        img.setDepth(depth)
        if (key.startsWith('ladder')) {
          img.setDepth(LAYER_BASE + py) // Ladders are between terrain and overhead
        }
        this.decorGroup.add(img)
      }
    }
  }

  private resolveDecorSprite(tile: number): { key: string; flipX: boolean; flipY: boolean } {
    let key   = ''
    let flipX = false
    let flipY = false

    switch (tile) {
      case DECOR.LEDGE_RIGHT:             key = 'ledge-right';             break
      case DECOR.LEDGE_BOTTOM:            key = 'ledge-bottom';            break
      case DECOR.LEDGE_INSET_LOWER_RIGHT: key = 'ledge-inset-lower-right'; break
      case DECOR.LEDGE_LOWER_RIGHT:       key = 'ledge-lower-right';       break
      case DECOR.LEDGE_TOP:               key = 'ledge-bottom';  flipY = true;                   break
      case DECOR.LEDGE_UPPER_RIGHT:       key = 'ledge-lower-right'; flipY = true;               break
      case DECOR.LEDGE_LOWER_LEFT:        key = 'ledge-lower-right'; flipX = true;               break
      case DECOR.LEDGE_UPPER_LEFT:        key = 'ledge-lower-right'; flipX = true; flipY = true; break
      case DECOR.LEDGE_INSET_LOWER_LEFT:  key = 'ledge-inset-lower-right'; flipX = true;         break

      case DECOR.WATER_RIGHT:             key = 'water-right';             break
      case DECOR.WATER_BOTTOM:            key = 'water-bottom';            break
      case DECOR.WATER_INSET_LOWER_RIGHT: key = 'water-inset-lower-right'; break
      case DECOR.WATER_LOWER_RIGHT:       key = 'water-lower-right';       break
      case DECOR.WATER_TOP:               key = 'water-bottom';  flipY = true;                   break
      case DECOR.WATER_LEFT:              key = 'water-right';   flipX = true;                   break
      case DECOR.WATER_UPPER_RIGHT:       key = 'water-lower-right'; flipY = true;               break
      case DECOR.WATER_LOWER_LEFT:        key = 'water-lower-right'; flipX = true;               break
      case DECOR.WATER_UPPER_LEFT:        key = 'water-lower-right'; flipX = true; flipY = true; break
      case DECOR.WATER_INSET_LOWER_LEFT:  key = 'water-inset-lower-right'; flipX = true;         break

      case DECOR.LADDER_TOP:    key = 'ladder-top';    break
      case DECOR.LADDER_MIDDLE: key = 'ladder-side';   break
      case DECOR.LADDER_BOTTOM: key = 'ladder-bottom'; break
    }

    return { key, flipX, flipY }
  }

  // =========================================================================
  // Helpers
  // =========================================================================
  private sendJoin(): void {
    if (this.joined) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useGameStore } = require('@/store/gameStore')
      const storeState = useGameStore.getState()
      const username   = storeState.username
      const character: number = storeState.selectedCharacter ?? 0
      if (username) {
        this.wsManager.send({ type: 'JOIN', payload: { username, character } })
        this.joined = true
        this.chatBubbleManager.createNametag('local', this.localPlayer.sprite, username, true)
      }
    } catch {
      // Store not available yet
    }
  }
}