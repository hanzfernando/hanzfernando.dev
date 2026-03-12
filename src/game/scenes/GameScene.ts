import Phaser from 'phaser'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, SPAWN_TILE_X, SPAWN_TILE_Y } from '@/game/constants'
import { COLLISION_MAP } from '@/game/map/collisionData'
import { TERRAIN, TERRAIN_MAP } from '@/game/map/terrainData'
import { EventBus, GameEvents } from '@/game/EventBus'
import { WebSocketManager } from '@/game/managers/WebSocketManager'
import { MovementThrottle } from '@/game/managers/MovementThrottle'
import { ChatBubbleManager } from '@/game/managers/ChatBubbleManager'
import { InteractionManager } from '@/game/managers/InteractionManager'
import { PlayerStateManager } from '@/game/managers/PlayerStateManager'
import { LocalPlayer } from '@/game/entities/LocalPlayer'
import type { ServerMessage } from '@/types/ws-protocol'
import { DECOR, DECOR_MAP } from '../map/decorData'

export class GameScene extends Phaser.Scene {
  private localPlayer!: LocalPlayer
  private wsManager!: WebSocketManager
  private movementThrottle!: MovementThrottle
  private chatBubbleManager!: ChatBubbleManager
  private interactionManager!: InteractionManager
  private playerStateManager!: PlayerStateManager
  private joined = false

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    // Show ~20 tiles across the shorter screen dimension.
    // This keeps the map larger than the viewport so the camera actually scrolls.
    const calcZoom = () => {
      const short = Math.min(this.scale.width, this.scale.height)
      return short / (20 * TILE_SIZE)
    }


    // Render the map
    this.renderMap()

    // Create local player with selected character
    this.wsManager = new WebSocketManager()
    let characterIndex = 0
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useGameStore } = require('@/store/gameStore')
      characterIndex = useGameStore.getState().selectedCharacter
    } catch {}
    this.localPlayer = new LocalPlayer(this, this.wsManager, SPAWN_TILE_X, SPAWN_TILE_Y, characterIndex)
    
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    this.cameras.main.setZoom(calcZoom())
    // Smooth follow so the camera tracks the player sprite across tiles
    this.cameras.main.startFollow(this.localPlayer.sprite, true, 0.12, 0.12)
    // Re-calculate zoom on orientation change / browser resize
    this.scale.on('resize', () => {
      this.cameras.main.setZoom(calcZoom())
    })

    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    
    // Create managers
    this.movementThrottle = new MovementThrottle(this.wsManager)
    this.localPlayer.setThrottle(this.movementThrottle)

    this.chatBubbleManager = new ChatBubbleManager(this)
    this.interactionManager = new InteractionManager(this)
    this.playerStateManager = new PlayerStateManager(this, this.chatBubbleManager)

    // WebSocket connection
    this.wsManager.connect(
      (msg: ServerMessage) => {
        this.playerStateManager.handleServerMessage(msg)

        if (msg.type === 'ROOM_STATE') {
          this.playerStateManager.setLocalId(msg.payload.yourId)
        }

        // Handle chat for local player too
        if (msg.type === 'CHAT' && msg.payload.id === this.playerStateManager['localId']) {
          this.chatBubbleManager.show({
            id: 'local',
            sprite: this.localPlayer.sprite,
            message: msg.payload.message,
            isLocal: true,
          })
        }

        // Pipe all chat messages into the history store
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

    // EventBus listeners
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

    // Send join if username is already set
    this.sendJoin()

    // Emit scene ready
    EventBus.emit(GameEvents.SCENE_READY)

    // Launch UI scene in parallel
    this.scene.launch('UIScene')
  }

  private sendJoin(): void {
    if (this.joined) return
    // Dynamic import to avoid SSR issues — read from zustand store
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useGameStore } = require('@/store/gameStore')
      const storeState = useGameStore.getState()
      const username = storeState.username
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

  private renderMap(): void {
    const rt = this.add.renderTexture(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    rt.setOrigin(0, 0)
    rt.setDepth(0)

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        rt.drawFrame('grass', undefined, x * TILE_SIZE, y * TILE_SIZE)
      }
    }

    // Houses and mailboxes as real images (rt.draw is unreliable for these)
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = TERRAIN_MAP[y][x]
        if (tile === TERRAIN.HOUSE) {
          const texture = this.textures.get('house').getSourceImage() as HTMLImageElement
          const houseW = texture.width
          const houseH = texture.height
          const splitY = Math.floor(houseH * 0.5)
          // Anchor is bottom-left: (x, y) tile is the bottom-left corner of the sprite
          const anchorPx = x * TILE_SIZE
          const anchorPy = (y + 1) * TILE_SIZE // bottom edge of anchor tile

          // Full house — origin at bottom-left
          const full = this.add.image(anchorPx, anchorPy, 'house')
          full.setOrigin(0, 1)
          full.setDepth(anchorPy - TILE_SIZE * 2)

          // Top portion — draw from computed sprite top
          const spriteTopY = anchorPy - houseH
          const top = this.add.renderTexture(anchorPx, spriteTopY, houseW, splitY)
          top.setOrigin(0, 0)
          top.draw('house', 0, 0)
          top.setDepth(anchorPy + houseH)
        }

        if (tile === TERRAIN.GREENHOUSE) {
          const texture = this.textures.get('greenhouse').getSourceImage() as HTMLImageElement
          const ghW = texture.width
          const ghH = texture.height
          const splitY = Math.floor(ghH * 0.2)

          const anchorPx = x * TILE_SIZE
          const anchorPy = (y + 1) * TILE_SIZE

          const full = this.add.image(anchorPx, anchorPy, 'greenhouse')
          full.setOrigin(0, 1)
          full.setDepth(anchorPy - TILE_SIZE * 2)

          const spriteTopY = anchorPy - ghH
          const top = this.add.renderTexture(anchorPx, spriteTopY, ghW, splitY)
          top.setOrigin(0, 0)
          top.draw('greenhouse', 0, 0)
          top.setDepth(anchorPy + ghH)
        }

        if (tile === TERRAIN.SAND) {
          rt.drawFrame('sand', undefined, x * TILE_SIZE, y * TILE_SIZE)
        }
        if (tile === TERRAIN.WATER) {
          rt.drawFrame('water', undefined, x * TILE_SIZE, y * TILE_SIZE)
        }

        if (tile === TERRAIN.MAILBOX) {
          rt.drawFrame('mailbox', undefined, x * TILE_SIZE, y * TILE_SIZE)
        }
      }     
    }

    this.addOverheadTrees()
    this.renderDecor()
  }

  private addOverheadTrees(): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (TERRAIN_MAP[y][x] === TERRAIN.TREE) {
          const texture = this.textures.get('tree').getSourceImage() as HTMLImageElement
          const treeW = texture.width
          const treeH = texture.height
          const splitY = Math.floor(treeH * 0.5)
          // Anchor is bottom-left
          const anchorPx = x * TILE_SIZE
          const anchorPy = (y + 1) * TILE_SIZE // bottom edge of anchor tile

          // Full tree — origin at bottom-left
          const full = this.add.image(anchorPx, anchorPy, 'tree')
          full.setOrigin(0, 1)
          full.setDepth(anchorPy - 1)

          // Top portion — floats above player
          const spriteTopY = anchorPy - treeH
          const top = this.add.renderTexture(anchorPx, spriteTopY, treeW, splitY)
          top.setOrigin(0, 0)
          top.draw('tree', 0, 0)
          top.setDepth(anchorPy + treeH)
        }
      }
    }
  }

  private renderDecor(): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = DECOR_MAP[y][x]
        if (tile === DECOR.NONE) continue

        const px = x * TILE_SIZE + TILE_SIZE / 2
        const py = y * TILE_SIZE + TILE_SIZE / 2

        if (tile === DECOR.FLOWER_BUSH) {
          const bush = this.add.image(px, py, 'flower_bush')
          bush.setOrigin(0.5, 0.5)
          bush.setDepth(py - TILE_SIZE / 2)
          continue
        }

        // Ledge sprites — base texture key + flip flags derived from direction
        let key = ''
        let flipX = false
        let flipY = false

        switch (tile) {
          case DECOR.LEDGE_RIGHT:             key = 'ledge-right';             break
          case DECOR.LEDGE_BOTTOM:            key = 'ledge-bottom';            break
          case DECOR.LEDGE_INSET_LOWER_RIGHT: key = 'ledge-inset-lower-right'; break
          case DECOR.LEDGE_LOWER_RIGHT:       key = 'ledge-lower-right';       break
          case DECOR.LEDGE_TOP:               key = 'ledge-bottom';            flipY = true;              break
          case DECOR.LEDGE_UPPER_RIGHT:       key = 'ledge-lower-right';       flipY = true;              break
          case DECOR.LEDGE_LOWER_LEFT:        key = 'ledge-lower-right';       flipX = true;              break
          case DECOR.LEDGE_UPPER_LEFT:        key = 'ledge-lower-right';       flipX = true; flipY = true; break
          case DECOR.LEDGE_INSET_LOWER_LEFT:  key = 'ledge-inset-lower-right'; flipX = true;              break
          // Water edges
          case DECOR.WATER_RIGHT:             key = 'water-right';             break
          case DECOR.WATER_BOTTOM:            key = 'water-bottom';            break
          case DECOR.WATER_INSET_LOWER_RIGHT: key = 'water-inset-lower-right'; break
          case DECOR.WATER_LOWER_RIGHT:       key = 'water-lower-right';       break
          case DECOR.WATER_TOP:               key = 'water-bottom';            flipY = true;               break
          case DECOR.WATER_LEFT:              key = 'water-right';             flipX = true;               break
          case DECOR.WATER_UPPER_RIGHT:       key = 'water-lower-right';       flipY = true;               break
          case DECOR.WATER_LOWER_LEFT:        key = 'water-lower-right';       flipX = true;               break
          case DECOR.WATER_UPPER_LEFT:        key = 'water-lower-right';       flipX = true; flipY = true;  break
          case DECOR.WATER_INSET_LOWER_LEFT:  key = 'water-inset-lower-right'; flipX = true;               break
          // Ladder
          case DECOR.LADDER_TOP:    key = 'ladder-top';    break
          case DECOR.LADDER_MIDDLE: key = 'ladder-side';   break
          case DECOR.LADDER_BOTTOM: key = 'ladder-bottom'; break
          default: continue
        }

        const img = this.add.image(px, py, key)
        img.setOrigin(0.5, 0.5)
        img.setFlipX(flipX)
        img.setFlipY(flipY)
        img.setDepth(py - TILE_SIZE - 3)
      }
    }
  }
  

  update(_time: number, delta: number): void {
    this.localPlayer.update(COLLISION_MAP)
    this.interactionManager.update(
      this.localPlayer.getTileX(),
      this.localPlayer.getTileY(),
      this.localPlayer.getDirection(),
    )
    this.playerStateManager.update(delta)
    this.chatBubbleManager.update()
    this.movementThrottle.tick()
  }

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
}
