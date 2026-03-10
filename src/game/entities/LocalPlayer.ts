import Phaser from 'phaser'
import { TILE_SIZE, MOVE_DURATION_MS, charSheetKey } from '@/game/constants'
import { COLLISION_MAP } from '@/game/map/collisionData'
import { EventBus, GameEvents } from '@/game/EventBus'
import type { WebSocketManager } from '@/game/managers/WebSocketManager'
import type { MovementThrottle } from '@/game/managers/MovementThrottle'

export class LocalPlayer {
  private scene: Phaser.Scene
  private ws: WebSocketManager
  private throttle: MovementThrottle | null = null
  public sprite: Phaser.GameObjects.Sprite

  private _tileX: number
  private _tileY: number
  private _direction: 'up' | 'down' | 'left' | 'right' = 'down'
  private _isMoving = false
  private inputEnabled = true
  private sheetKey: string

  // Mobile / on-screen input state
  private mobileInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  }
  private lastMobileDirection: 'up' | 'down' | 'left' | 'right' | null = null
  private pathQueue: Array<'up' | 'down' | 'left' | 'right'> = []

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: {
    W: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
  }

  constructor(scene: Phaser.Scene, ws: WebSocketManager, tileX: number, tileY: number, characterIndex: number = 0) {
    this.scene = scene
    this.ws = ws
    this._tileX = tileX
    this._tileY = tileY
    this.sheetKey = charSheetKey(characterIndex)

    const px = tileX * TILE_SIZE + TILE_SIZE / 2
    const py = tileY * TILE_SIZE + TILE_SIZE / 2

    this.sprite = scene.add.sprite(px, py, this.sheetKey, 0)
    this.sprite.play(`${this.sheetKey}-idle-down`)
    this.sprite.setDepth(py)

    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

    // Listen for mobile / on-screen D-pad events
    EventBus.on(GameEvents.MOBILE_MOVE, (payload: unknown) => {
      const data = payload as { direction: 'up' | 'down' | 'left' | 'right'; isDown: boolean }
      if (!data || !data.direction) return
      this.mobileInput[data.direction] = data.isDown
      if (data.isDown) {
        this.lastMobileDirection = data.direction
      } else {
        // If the released direction was the last direction, clear it so another active direction can take over
        if (this.lastMobileDirection === data.direction) {
          this.lastMobileDirection = null
        }
      }
    })

    // Listen for tap/click-to-move — computes BFS path and queues it
    EventBus.on(GameEvents.TOUCH_MOVE_TO, (payload: unknown) => {
      const { tileX, tileY } = payload as { tileX: number; tileY: number }
      this.pathQueue = this.computePath(this._tileX, this._tileY, tileX, tileY)
    })
  }

  setThrottle(throttle: MovementThrottle): void {
    this.throttle = throttle
  }

  setInputEnabled(enabled: boolean): void {
    this.inputEnabled = enabled
    if (!enabled) {
      // Stop any active movement animation immediately
      this.sprite.play(`${this.sheetKey}-idle-${this._direction}`, true)
    }
  }

  update(collisionMap: number[][]): void {
    this.sprite.setDepth(this.sprite.y)

    if (!this.inputEnabled || this._isMoving) {
      this.throttle?.tick()
      return
    }

    let dx = 0
    let dy = 0
    let newDir: 'up' | 'down' | 'left' | 'right' | null = null

    // 1. Prefer mobile / on-screen input if any direction is held
    const hasMobileInput = this.mobileInput.up || this.mobileInput.down || this.mobileInput.left || this.mobileInput.right
    const hasKeyboardInput =
      this.cursors.up.isDown || this.cursors.down.isDown ||
      this.cursors.left.isDown || this.cursors.right.isDown ||
      this.wasd.W.isDown || this.wasd.A.isDown ||
      this.wasd.S.isDown || this.wasd.D.isDown

    // Any manual input cancels an active tap-to-move path
    if (hasMobileInput || hasKeyboardInput) this.pathQueue = []

    if (hasMobileInput) {
      // Use last pressed mobile direction if available, otherwise fall back to a simple priority
      if (this.lastMobileDirection && this.mobileInput[this.lastMobileDirection]) {
        newDir = this.lastMobileDirection
      } else if (this.mobileInput.up) {
        newDir = 'up'
      } else if (this.mobileInput.down) {
        newDir = 'down'
      } else if (this.mobileInput.left) {
        newDir = 'left'
      } else if (this.mobileInput.right) {
        newDir = 'right'
      }
    } else if (hasKeyboardInput) {
      // 2. Fallback to keyboard / WASD controls (desktop)
      if (this.cursors.up.isDown || this.wasd.W.isDown) {
        dy = -1
        newDir = 'up'
      } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
        dy = 1
        newDir = 'down'
      } else if (this.cursors.left.isDown || this.wasd.A.isDown) {
        dx = -1
        newDir = 'left'
      } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        dx = 1
        newDir = 'right'
      }
    } else if (this.pathQueue.length > 0) {
      // 3. Tap-to-move: consume next BFS step
      newDir = this.pathQueue[0]
    }

    if (!newDir) {
      this.throttle?.tick()
      return
    }

    // Update direction and play appropriate animation
    if (newDir !== this._direction) {
      this._direction = newDir
    }

    // Derive movement delta from chosen direction
    if (newDir === 'up') {
      dy = -1
    } else if (newDir === 'down') {
      dy = 1
    } else if (newDir === 'left') {
      dx = -1
    } else if (newDir === 'right') {
      dx = 1
    }

    const nextX = this._tileX + dx
    const nextY = this._tileY + dy

    // Check bounds and collision
    if (
      nextX < 0 || nextX >= collisionMap[0].length ||
      nextY < 0 || nextY >= collisionMap.length ||
      collisionMap[nextY][nextX] === 1
    ) {
      // Blocked: abandon tap-to-move path, show idle
      this.pathQueue = []
      this.sprite.play(`${this.sheetKey}-idle-${this._direction}`, true)
      this.throttle?.push({
        x: this._tileX,
        y: this._tileY,
        direction: this._direction,
        isMoving: false,
      })
      this.throttle?.tick()
      return
    }

    // Consume the path step now that the move is confirmed
    if (this.pathQueue.length > 0) this.pathQueue.shift()

    // Move
    this._isMoving = true
    this._tileX = nextX
    this._tileY = nextY

    // Play walk animation for current direction
    this.sprite.play(`${this.sheetKey}-walk-${this._direction}`, true)

    const targetPx = nextX * TILE_SIZE + TILE_SIZE / 2
    const targetPy = nextY * TILE_SIZE + TILE_SIZE / 2

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetPx,
      y: targetPy,
      duration: MOVE_DURATION_MS,
      ease: 'Linear',
      onComplete: () => {
        this._isMoving = false
        // Return to idle when movement ends
        this.sprite.play(`${this.sheetKey}-idle-${this._direction}`, true)
        this.throttle?.push({
          x: this._tileX,
          y: this._tileY,
          direction: this._direction,
          isMoving: false,
        })
      },
    })

    this.throttle?.push({
      x: this._tileX,
      y: this._tileY,
      direction: this._direction,
      isMoving: true,
    })
    this.throttle?.tick()
  }

  getTileX(): number { return this._tileX }
  getTileY(): number { return this._tileY }
  getDirection(): string { return this._direction }
  getPixelX(): number { return this.sprite.x }
  getPixelY(): number { return this.sprite.y }

  /** BFS pathfinding on the static collision map. Returns ordered directions to walk. */
  private computePath(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ): Array<'up' | 'down' | 'left' | 'right'> {
    const rows = COLLISION_MAP.length
    const cols = COLLISION_MAP[0].length
    if (toX < 0 || toX >= cols || toY < 0 || toY >= rows) return []
    if (COLLISION_MAP[toY][toX] === 1) return []

    type Dir = 'up' | 'down' | 'left' | 'right'
    const DIRS: Array<{ dx: number; dy: number; dir: Dir }> = [
      { dx: 0, dy: -1, dir: 'up' },
      { dx: 0, dy: 1, dir: 'down' },
      { dx: -1, dy: 0, dir: 'left' },
      { dx: 1, dy: 0, dir: 'right' },
    ]

    const visited = new Set<string>()
    const queue: Array<{ x: number; y: number; path: Dir[] }> = []
    visited.add(`${fromX},${fromY}`)
    queue.push({ x: fromX, y: fromY, path: [] })

    while (queue.length > 0) {
      const current = queue.shift()!
      if (current.x === toX && current.y === toY) return current.path
      for (const d of DIRS) {
        const nx = current.x + d.dx
        const ny = current.y + d.dy
        const key = `${nx},${ny}`
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue
        if (COLLISION_MAP[ny][nx] === 1) continue
        if (visited.has(key)) continue
        visited.add(key)
        queue.push({ x: nx, y: ny, path: [...current.path, d.dir] })
      }
    }
    return []
  }

  destroy(): void {
    EventBus.off(GameEvents.MOBILE_MOVE)
    EventBus.off(GameEvents.TOUCH_MOVE_TO)
    this.sprite.destroy()
  }
}
