import Phaser from 'phaser'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, SPAWN_TILE_X, SPAWN_TILE_Y } from '@/game/constants'
import { COLLISION_MAP } from '@/game/map/collisionData'
import { EventBus, GameEvents } from '@/game/EventBus'
import { WebSocketManager } from '@/game/managers/WebSocketManager'
import { MovementThrottle } from '@/game/managers/MovementThrottle'
import { ChatBubbleManager } from '@/game/managers/ChatBubbleManager'
import { InteractionManager } from '@/game/managers/InteractionManager'
import { PlayerStateManager } from '@/game/managers/PlayerStateManager'
import { LocalPlayer } from '@/game/entities/LocalPlayer'
import type { ServerMessage } from '@/types/ws-protocol'

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
    // Set world bounds
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)

    // Render the map
    this.renderMap()

    // Create local player
    this.wsManager = new WebSocketManager()
    this.localPlayer = new LocalPlayer(this, this.wsManager, SPAWN_TILE_X, SPAWN_TILE_Y)

    // Create managers
    this.movementThrottle = new MovementThrottle(this.wsManager)
    this.localPlayer.setThrottle(this.movementThrottle)

    this.chatBubbleManager = new ChatBubbleManager(this)
    this.interactionManager = new InteractionManager(this)
    this.playerStateManager = new PlayerStateManager(this, this.chatBubbleManager)

    // WebSocket connection
    this.wsManager.connect((msg: ServerMessage) => {
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
        })
      }
    })

    // EventBus listeners
    EventBus.on(GameEvents.CHAT_SENT, (...args: unknown[]) => {
      const message = args[0] as string
      this.wsManager.send({ type: 'CHAT', payload: { message } })
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
      const username = useGameStore.getState().username
      if (username) {
        this.wsManager.send({ type: 'JOIN', payload: { username } })
        this.joined = true
      }
    } catch {
      // Store not available yet
    }
  }

  private renderMap(): void {
    // Render texture to bake static map
    const rt = this.add.renderTexture(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    rt.setOrigin(0, 0)
    rt.setDepth(0)

    // 1. Fill with grass
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        rt.drawFrame('grass', undefined, x * TILE_SIZE, y * TILE_SIZE)
      }
    }

    // 2. Draw paths — horizontal at y=11, vertical at x=15,16,17
    for (let x = 6; x < 27; x++) {
      rt.drawFrame('path-tile', undefined, x * TILE_SIZE, 11 * TILE_SIZE)
    }
    for (let y = 3; y < 21; y++) {
      rt.drawFrame('path-tile', undefined, 15 * TILE_SIZE, y * TILE_SIZE)
      rt.drawFrame('path-tile', undefined, 16 * TILE_SIZE, y * TILE_SIZE)
      rt.drawFrame('path-tile', undefined, 17 * TILE_SIZE, y * TILE_SIZE)
    }
    // North gap path
    for (let y = 0; y < 3; y++) {
      rt.drawFrame('path-tile', undefined, 15 * TILE_SIZE, y * TILE_SIZE)
      rt.drawFrame('path-tile', undefined, 16 * TILE_SIZE, y * TILE_SIZE)
      rt.drawFrame('path-tile', undefined, 17 * TILE_SIZE, y * TILE_SIZE)
    }

    // 3. Draw houses (house.png = 6×5 tiles = 96×80px)
    // Player house: collision cols 9-13, rows 7-10 → sprite at tile (9, 6)
    rt.drawFrame('house', undefined, 9 * TILE_SIZE, 6 * TILE_SIZE)
    // Neighbor house: collision cols 19-23, rows 7-10 → sprite at tile (19, 6)
    rt.drawFrame('house', undefined, 19 * TILE_SIZE, 6 * TILE_SIZE)

    // 4. Lab (same house sprite): collision cols 9-13, rows 14-17 → sprite at tile (9, 13)
    rt.drawFrame('house', undefined, 9 * TILE_SIZE, 13 * TILE_SIZE)

    // 5. Draw mailbox near player house
    rt.drawFrame('mailbox-sprite', undefined, 8 * TILE_SIZE, 11 * TILE_SIZE)

    // 6. Draw border trees (3×3 tree sprites)
    // Left border: cols 0-5 (2 trees wide), Right border: cols 27-32 (2 trees wide)
    // Top border: rows 0-2 (1 tree tall), Bottom border: rows 21-23 (1 tree tall)
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const isLeftRight = x < 6 || x >= 27
        const isTopBottom = y < 3 || y >= 21
        const isBorder = isLeftRight || isTopBottom
        const isNorthGap = (x >= 15 && x <= 17) && y < 3
        if (isBorder && !isNorthGap && x % 3 === 0 && y % 3 === 0) {
          rt.drawFrame('tree', undefined, x * TILE_SIZE, y * TILE_SIZE)
        }
      }
    }

    // Also add overhead tree sprites above the render texture for depth
    this.addOverheadTrees()
  }

  private addOverheadTrees(): void {
    // Place tree sprites at higher depth for overhead effect on border
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const isLeftRight = x < 6 || x >= 27
        const isTopBottom = y < 3 || y >= 21
        const isBorder = isLeftRight || isTopBottom
        const isNorthGap = (x >= 15 && x <= 17) && y < 3
        if (isBorder && !isNorthGap && x % 3 === 0 && y % 3 === 0) {
          const tree = this.add.image(x * TILE_SIZE, y * TILE_SIZE, 'tree')
          tree.setOrigin(0, 0)
          tree.setDepth(50)
        }
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
    EventBus.off(GameEvents.USERNAME_SET)
    this.wsManager.disconnect()
    this.chatBubbleManager.destroy()
    this.interactionManager.destroy()
    this.playerStateManager.destroy()
    this.localPlayer.destroy()
  }
}
