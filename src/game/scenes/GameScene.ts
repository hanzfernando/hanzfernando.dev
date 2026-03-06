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
    // Center camera on the map (map is smaller than viewport)
    const mapPxW = MAP_WIDTH * TILE_SIZE
    const mapPxH = MAP_HEIGHT * TILE_SIZE
    this.cameras.main.centerOn(mapPxW / 2, mapPxH / 2)

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

    // 2. Compute layout helpers for border/trees
    const midX = Math.floor(MAP_WIDTH / 2)
    const verticalCols = [midX - 1, midX, midX + 1]

    // 3. Draw houses (house.png = 6×5 tiles = 96×80px)
    // Player house: collision cols 9-13, rows 7-10 → sprite at tile (9, 7)
    rt.drawFrame('house', undefined, 9 * TILE_SIZE, 7 * TILE_SIZE)
    // Neighbor house: collision cols 19-23, rows 7-10 → sprite at tile (19, 7)
    rt.drawFrame('house', undefined, 24 * TILE_SIZE, 7 * TILE_SIZE)

    // 4. Lab (same house sprite): collision cols 9-13, rows 14-17 → sprite at tile (9, 14)
    rt.drawFrame('house', undefined, 9 * TILE_SIZE, 14 * TILE_SIZE)

    // 5. Draw mailbox near player house
    rt.drawFrame('mailbox-sprite', undefined, 8 * TILE_SIZE, 11 * TILE_SIZE)

    // 6. Draw border trees (3×3 tree sprites) using margins derived from map size
    const borderWidth = 6 // two 3-tile tree columns on left/right
    const borderHeight = 3 // top/bottom tree rows
    const rightStart = MAP_WIDTH - borderWidth
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const isLeftRight = x < borderWidth || x >= rightStart
        const isTopBottom = y < borderHeight || y >= MAP_HEIGHT - borderHeight
        const isBorder = isLeftRight || isTopBottom
        const isNorthGap = verticalCols.includes(x) && y < borderHeight
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
    const borderWidth = 6
    const borderHeight = 3
    const rightStart = MAP_WIDTH - borderWidth
    const midX = Math.floor(MAP_WIDTH / 2)
    const verticalCols = [midX - 1, midX, midX + 1]
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const isLeftRight = x < borderWidth || x >= rightStart
        const isTopBottom = y < borderHeight || y >= MAP_HEIGHT - borderHeight
        const isBorder = isLeftRight || isTopBottom
        const isNorthGap = verticalCols.includes(x) && y < borderHeight
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
    EventBus.off(GameEvents.CHAT_FOCUS)
    EventBus.off(GameEvents.USERNAME_SET)
    this.wsManager.disconnect()
    this.chatBubbleManager.destroy()
    this.interactionManager.destroy()
    this.playerStateManager.destroy()
    this.localPlayer.destroy()
  }
}
