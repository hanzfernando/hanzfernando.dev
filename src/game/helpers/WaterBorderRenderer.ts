// src/game/helpers/WaterBorderRenderer.ts
import Phaser from 'phaser'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '@/game/constants'
import { BASE, BaseTile } from '@/game/map/terrainData'

// Water border tile indices (3x3 spritesheet)
// Pattern: Sand with water in specific positions
// S S S
// S W S
// S S S
export const WATER_BORDER = {
  // Corner pieces (sand with water in corner)
  TOP_LEFT: 0,      // Water in top-left corner
  TOP_MIDDLE: 1,    // Water above
  TOP_RIGHT: 2,     // Water in top-right corner
  MIDDLE_LEFT: 3,   // Water to the left
  CENTER: 4,        // Pure water (not used for sand)
  MIDDLE_RIGHT: 5,  // Water to the right
  BOTTOM_LEFT: 6,   // Water in bottom-left corner
  BOTTOM_MIDDLE: 7, // Water below
  BOTTOM_RIGHT: 8,  // Water in bottom-right corner
} as const

// Water corner tile indices (2x2 spritesheet)
// Pattern: Sand with water in multiple directions (inset/peninsula)
// W W W
// W S W
// W W W
export const WATER_CORNER = {
  TOP_LEFT_INSET: 0,     // Sand with water in all directions except maybe one
  TOP_RIGHT_INSET: 1,    // (these are for when sand is surrounded by water)
  BOTTOM_LEFT_INSET: 2,  // Used for "islands" or "peninsulas" of sand
  BOTTOM_RIGHT_INSET: 3,
} as const

export type WaterBorderTile = typeof WATER_BORDER[keyof typeof WATER_BORDER]
export type WaterCornerTile = typeof WATER_CORNER[keyof typeof WATER_CORNER]

interface Neighbors {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
  topLeft: boolean
  topRight: boolean
  bottomLeft: boolean
  bottomRight: boolean
}

export class WaterBorderRenderer {
  private scene: Phaser.Scene
  private borderSheetKey: string  // 3x3 spritesheet for edges
  private cornerSheetKey: string   // 2x2 spritesheet for inset/peninsula
  private tileSize: number

  constructor(
    scene: Phaser.Scene,
    borderSheetKey: string = 'water-border',
    cornerSheetKey: string = 'water-corner',
    tileSize: number = TILE_SIZE
  ) {
    this.scene = scene
    this.borderSheetKey = borderSheetKey
    this.cornerSheetKey = cornerSheetKey
    this.tileSize = tileSize
  }

  /**
   * Check if a tile is water
   */
  private isWater(tile: BaseTile): boolean {
    return tile === BASE.WATER
  }

  /**
   * Check if a tile is sand (the tile we want to add borders to)
   */
  private isSand(tile: BaseTile): boolean {
    return tile === BASE.SAND
  }

  /**
   * Get the 8 neighboring tiles for a position
   */
  private getNeighbors(
    baseMap: BaseTile[][],
    x: number,
    y: number
  ): Neighbors {
    const isWater = (cx: number, cy: number): boolean => {
      if (cx < 0 || cx >= MAP_WIDTH || cy < 0 || cy >= MAP_HEIGHT) {
        return false // Out of bounds treated as non-water
      }
      return this.isWater(baseMap[cy][cx])
    }

    return {
      top: isWater(x, y - 1),
      bottom: isWater(x, y + 1),
      left: isWater(x - 1, y),
      right: isWater(x + 1, y),
      topLeft: isWater(x - 1, y - 1),
      topRight: isWater(x + 1, y - 1),
      bottomLeft: isWater(x - 1, y + 1),
      bottomRight: isWater(x + 1, y + 1),
    }
  }

  /**
   * Count how many adjacent water tiles (cardinal directions)
   */
  private countCardinalWater(neighbors: Neighbors): number {
    let count = 0
    if (neighbors.top) count++
    if (neighbors.bottom) count++
    if (neighbors.left) count++
    if (neighbors.right) count++
    return count
  }

  /**
   * Count how many diagonal water tiles
   */
  private countDiagonalWater(neighbors: Neighbors): number {
    let count = 0
    if (neighbors.topLeft) count++
    if (neighbors.topRight) count++
    if (neighbors.bottomLeft) count++
    if (neighbors.bottomRight) count++
    return count
  }

  public getBorderTileForSand(neighbors: Neighbors, x: number, y: number): { sheet: string, frame: number } | null {
    const { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight } = neighbors
    
    const cardinalCount = this.countCardinalWater(neighbors)
    const diagonalCount = this.countDiagonalWater(neighbors)

    // Log the full pattern first
    console.log(`[${x},${y}] Neighbor pattern:`, {
      N: top ? 'W' : '.',
      S: bottom ? 'W' : '.',
      E: right ? 'W' : '.',
      W: left ? 'W' : '.',
      NE: topRight ? 'W' : '.',
      NW: topLeft ? 'W' : '.',
      SE: bottomRight ? 'W' : '.',
      SW: bottomLeft ? 'W' : '.',
      cardinalCount,
      diagonalCount
    })

    // If no adjacent water at all, no border needed
    if (cardinalCount === 0 && diagonalCount === 0) {
      console.log(`[${x},${y}] No water neighbors`)
      return null
    }

    // Use CORNER sheet when we have at least 2 cardinal directions AND at least 1 diagonal
    if (cardinalCount >= 2 && diagonalCount >= 1) {
      console.log(`[${x},${y}] cardinal=${cardinalCount}, diagonal=${diagonalCount} -> using CORNER sheet`)
      
      // Map to WATER_CORNER frames based on which directions are DRY (no water)
      const dryTop = !top
      const dryBottom = !bottom
      const dryLeft = !left
      const dryRight = !right
      
      // Determine which corner is dry (has no cardinal water)
      if (dryTop && dryLeft) {
        // Top-left corner is dry
        return { sheet: this.cornerSheetKey, frame: WATER_CORNER.BOTTOM_RIGHT_INSET }
      }
      if (dryTop && dryRight) {
        // Top-right corner is dry
        return { sheet: this.cornerSheetKey, frame: WATER_CORNER.TOP_RIGHT_INSET }
      }
      if (dryBottom && dryLeft) {
        // Bottom-left corner is dry
        return { sheet: this.cornerSheetKey, frame: WATER_CORNER.TOP_RIGHT_INSET }
      }
      if (dryBottom && dryRight) {
        // Bottom-right corner is dry
        return { sheet: this.cornerSheetKey, frame: WATER_CORNER.BOTTOM_RIGHT_INSET }
      }
      
      // If all cardinal directions have water, check diagonals to determine the "dry" diagonal
      if (cardinalCount === 4) {
        if (!topLeft) return { sheet: this.cornerSheetKey, frame: WATER_CORNER.BOTTOM_RIGHT_INSET }
        if (!topRight) return { sheet: this.cornerSheetKey, frame: WATER_CORNER.TOP_RIGHT_INSET }
        if (!bottomLeft) return { sheet: this.cornerSheetKey, frame: WATER_CORNER.BOTTOM_LEFT_INSET }
        if (!bottomRight) return { sheet: this.cornerSheetKey, frame: WATER_CORNER.TOP_LEFT_INSET }
      }
      
      // Default fallback for corner sheet
      return { sheet: this.cornerSheetKey, frame: WATER_CORNER.TOP_LEFT_INSET }
    }

    // Otherwise use BORDER sheet
    console.log(`[${x},${y}] cardinal=${cardinalCount}, diagonal=${diagonalCount} -> using BORDER sheet`)
    
    // SINGLE CARDINAL DIRECTIONS
    if (top && !bottom && !left && !right) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.BOTTOM_MIDDLE }
    }
    if (bottom && !top && !left && !right) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_MIDDLE }
    }
    if (left && !right && !top && !bottom) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.MIDDLE_RIGHT }
    }
    if (right && !left && !top && !bottom) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.MIDDLE_LEFT }
    }

    // TWO CARDINAL DIRECTIONS (corners) - no diagonals
    if (top && left && !right && !bottom && !topLeft && !topRight && !bottomLeft && !bottomRight) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_LEFT }
    }
    if (top && right && !left && !bottom && !topLeft && !topRight && !bottomLeft && !bottomRight) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.BOTTOM_LEFT }
    }
    if (bottom && left && !top && !right && !topLeft && !topRight && !bottomLeft && !bottomRight) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_RIGHT }
    }
    if (bottom && right && !top && !left && !topLeft && !topRight && !bottomLeft && !bottomRight) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_LEFT }
    }

    // DIAGONAL-ONLY WATER
    if (topLeft && !top && !left && !topRight && !bottomLeft) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_LEFT }
    }
    if (topRight && !top && !right && !topLeft && !bottomRight) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.BOTTOM_LEFT }
    }
    if (bottomLeft && !bottom && !left && !topLeft && !bottomRight) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.BOTTOM_LEFT }
    }
    if (bottomRight && !bottom && !right && !topRight && !bottomLeft) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_LEFT }
    }

    // OPPOSITE CARDINAL DIRECTIONS (stripes) - no diagonals
    if (top && bottom && !left && !right) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.CENTER } // Vertical strip
    }
    if (left && right && !top && !bottom) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.CENTER } // Horizontal strip
    }

    // THREE CARDINAL DIRECTIONS - no diagonals
    if (top && bottom && left && !right) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.MIDDLE_RIGHT }
    }
    if (top && bottom && right && !left) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.MIDDLE_LEFT }
    }
    if (top && left && right && !bottom) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.BOTTOM_MIDDLE }
    }
    if (bottom && left && right && !top) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.TOP_MIDDLE }
    }

    // ALL FOUR CARDINAL DIRECTIONS - no diagonals
    if (top && bottom && left && right) {
      return { sheet: this.borderSheetKey, frame: WATER_BORDER.CENTER }
    }

    // Default fallback
    console.log(`[${x},${y}] Default fallback -> border CENTER`)
    return { sheet: this.borderSheetKey, frame: WATER_BORDER.CENTER }
  }

/**
 * Render sand borders for the entire map
 * This modifies sand tiles that are adjacent to water
 */
public renderAll(
  renderTexture: Phaser.GameObjects.RenderTexture,
  baseMap: BaseTile[][]
): void {
  // First pass: draw all sand tiles (plain sand)
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = baseMap[y][x]
      if (this.isSand(tile)) {
        renderTexture.drawFrame('sand', undefined, x * this.tileSize, y * this.tileSize)
      }
    }
  }

  // Second pass: overlay borders on sand tiles that need them
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = baseMap[y][x]
      
      if (this.isSand(tile)) {
        const neighbors = this.getNeighbors(baseMap, x, y)
        const borderTile = this.getBorderTileForSand(neighbors, x, y)
        
        if (borderTile !== null) {
          console.log(`Rendering at [${x},${y}]:`, borderTile)
          renderTexture.drawFrame(
            borderTile.sheet,
            borderTile.frame,
            x * this.tileSize,
            y * this.tileSize
          )
        }
      }
    }
  }
}

  /**
   * Alternative method: render sand borders as separate sprites
   */
  public renderAsSprites(
    container: Phaser.GameObjects.Group,
    baseMap: BaseTile[][]
  ): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = baseMap[y][x]
        
        if (this.isSand(tile)) {
          const neighbors = this.getNeighbors(baseMap, x, y)
          const borderTile = this.getBorderTileForSand(neighbors, x, y)
          
          if (borderTile !== null) {
            const sprite = this.scene.add.sprite(
              x * this.tileSize + this.tileSize / 2,
              y * this.tileSize + this.tileSize / 2,
              borderTile.sheet,
              borderTile.frame
            )
            sprite.setOrigin(0.5, 0.5)
            container.add(sprite)
          }
        }
      }
    }
  }
}