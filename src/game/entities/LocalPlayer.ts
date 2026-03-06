import Phaser from 'phaser'
import { TILE_SIZE, MOVE_DURATION_MS, charSheetKey } from '@/game/constants'
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

    // scene.cameras.main.startFollow(this.sprite, true, 0.08, 0.08)
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

    if (!newDir) {
      this.throttle?.tick()
      return
    }

    // Update direction and play appropriate animation
    if (newDir !== this._direction) {
      this._direction = newDir
    }

    const nextX = this._tileX + dx
    const nextY = this._tileY + dy

    // Check bounds and collision
    if (
      nextX < 0 || nextX >= collisionMap[0].length ||
      nextY < 0 || nextY >= collisionMap.length ||
      collisionMap[nextY][nextX] === 1
    ) {
      // Blocked: update direction only, show idle in that direction
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

  destroy(): void {
    this.sprite.destroy()
  }
}
