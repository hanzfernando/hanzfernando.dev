// game/helpers/FenceRenderer.ts
import Phaser from 'phaser'
import { TERRAIN, TERRAIN_MAP } from '@/game/map/terrainData'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '@/game/constants'
import { LAYER_BASE, LAYER_OVERHEAD } from '@/game/scenes/GameScene'

/**
 * FenceRenderer
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders fences split into lower (Y-sorted) and upper (overhead) portions
 * so players can appear behind the top 5 pixels of fences when below them.
 *
 * Uses the same 3×3 spritesheet pattern as PathAutotiler:
 * 
 *   ┌──┬──┬──┐
 *   │0 │1 │2 │  TL · TE · TR
 *   ├──┼──┼──┤
 *   │3 │4 │5 │  LE · IN · RE
 *   ├──┼──┼──┤
 *   │6 │7 │8 │  BL · BE · BR
 *   └──┴──┴──┘
 */

// ─── Cardinal map (same as PathAutotiler) ─────────────────────────────────
const CARDINAL_FRAMES = new Uint8Array([
  4, // 0  isolated
  8, // 1  N
  6, // 2  E
  6, // 3  N+E
  8, // 4  S
  3, // 5  N+S
  0, // 6  E+S
  3, // 7  N+E+S
  8, // 8  W
  8, // 9  N+W
  1, // 10 E+W
  7, // 11 N+E+W
  2, // 12 S+W
  5, // 13 N+S+W
  1, // 14 E+S+W
  4, // 15 all neighbours
])

export type FenceRendererConfig = {
  /** Texture key for the fence spritesheet (3×3 frames of tileSize×tileSize) */
  sheetKey: string
  /** Tile size in pixels. Must match spritesheet frame dimensions. Default 16. */
  tileSize?: number
  /** Height in pixels of the fence top that should be rendered at overhead depth. Default 5. */
  topOverlapHeight?: number
}

export class FenceRenderer {
  private readonly sheetKey: string
  private readonly tileSize: number
  private readonly topOverlapHeight: number
  private scene: Phaser.Scene
  private terrainGroup!: Phaser.GameObjects.Group
  private overheadGroup!: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene, config: FenceRendererConfig) {
    this.scene = scene
    this.sheetKey = config.sheetKey
    this.tileSize = config.tileSize ?? 16
    this.topOverlapHeight = config.topOverlapHeight ?? 5
  }

  /**
   * Render all fences from TERRAIN_MAP into the provided groups.
   * Call this once during scene creation.
   */
  renderAll(
    terrainGroup: Phaser.GameObjects.Group,
    overheadGroup: Phaser.GameObjects.Group
  ): void {
    this.terrainGroup = terrainGroup
    this.overheadGroup = overheadGroup

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (TERRAIN_MAP[y][x] === TERRAIN.FENCE) {
          this.renderFenceAt(x, y)
        }
      }
    }
  }

  /**
   * Render a single fence at the specified tile coordinates.
   * Useful for incremental updates.
   */
  renderFenceAt(x: number, y: number): void {
    const px = x * this.tileSize
    const py = y * this.tileSize
    
    // Calculate cardinal mask for fence connections
    const mask = this.getFenceMask(x, y)
    const frame = CARDINAL_FRAMES[mask]
    
    // Get frame dimensions
    const texture = this.scene.textures.get(this.sheetKey)
    const frameObj = texture.get(frame)
    const frameHeight = frameObj.height
    const frameWidth = frameObj.width
    
    // Calculate split point (top N pixels go to overhead)
    const splitY = Math.max(0, frameHeight - this.topOverlapHeight)
    
    // ── Lower part (main fence body) - Y-sorted ──
    // Players below the fence will be behind this part
    const lowerFence = this.scene.add.image(px, py, this.sheetKey, frame)
    lowerFence.setOrigin(0, 0)
    lowerFence.setCrop(0, 0, frameWidth, splitY)
    lowerFence.setDepth(LAYER_BASE + py + this.tileSize) // Sorted by bottom of tile
    this.terrainGroup.add(lowerFence)
    
    // ── Upper part (top N pixels) - Overhead depth ──
    // Players below the fence will appear in front of this part
    const upperFence = this.scene.add.image(px, py, this.sheetKey, frame)
    upperFence.setOrigin(0, 0)
    upperFence.setCrop(0, splitY, frameWidth, this.topOverlapHeight)
    upperFence.setDepth(LAYER_OVERHEAD + py) // Overhead depth
    this.overheadGroup.add(upperFence)
  }

  /**
   * Update a specific fence tile (e.g., after map changes)
   */
  updateTile(x: number, y: number): void {
    // Remove existing fence sprites at this tile
    // Render the new one
    if (TERRAIN_MAP[y][x] === TERRAIN.FENCE) {
      this.renderFenceAt(x, y)
    }
  }

  /**
   * Calculate cardinal mask for fence connections
   */
  private getFenceMask(x: number, y: number): number {
    let mask = 0
    if (this.isFenceAt(x, y - 1)) mask |= 1 // N
    if (this.isFenceAt(x + 1, y)) mask |= 2 // E
    if (this.isFenceAt(x, y + 1)) mask |= 4 // S
    if (this.isFenceAt(x - 1, y)) mask |= 8 // W
    return mask
  }

  private isFenceAt(x: number, y: number): boolean {
    if (x < 0 || y < 0 || y >= MAP_HEIGHT || x >= MAP_WIDTH) return false
    return TERRAIN_MAP[y][x] === TERRAIN.FENCE
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // Nothing to clean up currently
  }
}