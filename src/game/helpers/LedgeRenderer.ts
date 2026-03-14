// src/game/helpers/LedgeRenderer.ts
import Phaser from 'phaser'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '@/game/constants'
import { BASE, BaseTile } from '@/game/map/terrainData'

// Ledge tile indices (3x3 spritesheet)
// These are drawn on GRASS tiles that border SAND
// The frame indicates which side(s) have sand adjacent
export const LEDGE = {
  TOP_LEFT: 0,      // Sand in top-left (grass bottom-right)
  TOP_MIDDLE: 1,    // Sand above (grass below)
  TOP_RIGHT: 2,     // Sand in top-right (grass bottom-left)
  MIDDLE_LEFT: 3,   // Sand to the left (grass right)
  CENTER: 4,        // Sand all around (grass isolated)
  MIDDLE_RIGHT: 5,  // Sand to the right (grass left)
  BOTTOM_LEFT: 6,   // Sand in bottom-left (grass top-right)
  BOTTOM_MIDDLE: 7, // Sand below (grass above)
  BOTTOM_RIGHT: 8,  // Sand in bottom-right (grass top-left)
} as const

// Ledge inset tile indices (2x2 spritesheet)
// Used when grass is surrounded by sand on most sides
export const LEDGE_INSET = {
  TOP_LEFT_INSET: 0,     // Grass in top-left corner, sand elsewhere
  TOP_RIGHT_INSET: 1,    // Grass in top-right corner, sand elsewhere
  BOTTOM_LEFT_INSET: 2,  // Grass in bottom-left corner, sand elsewhere
  BOTTOM_RIGHT_INSET: 3, // Grass in bottom-right corner, sand elsewhere
} as const

export type LedgeTile = typeof LEDGE[keyof typeof LEDGE]
export type LedgeInsetTile = typeof LEDGE_INSET[keyof typeof LEDGE_INSET]

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

export class LedgeRenderer {
  private scene: Phaser.Scene
  private ledgeSheetKey: string  // 3x3 spritesheet for edges (grass with sand on one side)
  private insetSheetKey: string   // 2x2 spritesheet for inset (grass surrounded by sand)
  private tileSize: number

  constructor(
    scene: Phaser.Scene,
    ledgeSheetKey: string = 'ledge',
    insetSheetKey: string = 'ledge-inset',
    tileSize: number = TILE_SIZE
  ) {
    this.scene = scene
    this.ledgeSheetKey = ledgeSheetKey
    this.insetSheetKey = insetSheetKey
    this.tileSize = tileSize

  }

  /**
   * Check if a tile is grass (the tile we want to add ledges TO)
   * Ledges are drawn ON grass tiles that are next to sand
   */
  private isGrass(tile: BaseTile): boolean {
    return tile === BASE.GRASS
  }

  /**
   * Check if a tile is sand (the tile we're checking FOR)
   * Grass tiles get ledges if they have sand neighbors
   */
  private isSand(tile: BaseTile): boolean {
    return tile === BASE.SAND
  }

  /**
   * Get the 8 neighboring tiles for a position
   * Returns true where sand is found (grass is the base, sand is what we're looking for)
   */
  private getNeighbors(
    baseMap: BaseTile[][],
    x: number,
    y: number
  ): Neighbors {
    const isSand = (cx: number, cy: number): boolean => {
      if (cx < 0 || cx >= MAP_WIDTH || cy < 0 || cy >= MAP_HEIGHT) {
        return false // Out of bounds treated as non-sand
      }
      return this.isSand(baseMap[cy][cx])
    }

    return {
      top: isSand(x, y - 1),
      bottom: isSand(x, y + 1),
      left: isSand(x - 1, y),
      right: isSand(x + 1, y),
      topLeft: isSand(x - 1, y - 1),
      topRight: isSand(x + 1, y - 1),
      bottomLeft: isSand(x - 1, y + 1),
      bottomRight: isSand(x + 1, y + 1),
    }
  }

  /**
   * Count how many adjacent sand tiles (cardinal directions)
   * These are the main directions that create ledge edges
   */
  private countCardinalSand(neighbors: Neighbors): number {
    let count = 0
    if (neighbors.top) count++
    if (neighbors.bottom) count++
    if (neighbors.left) count++
    if (neighbors.right) count++
    return count
  }

  /**
   * Count how many diagonal sand tiles
   * These create corner cases
   */
  private countDiagonalSand(neighbors: Neighbors): number {
    let count = 0
    if (neighbors.topLeft) count++
    if (neighbors.topRight) count++
    if (neighbors.bottomLeft) count++
    if (neighbors.bottomRight) count++
    return count
  }

  public getLedgeTileForGrass(neighbors: Neighbors, x: number, y: number): { sheet: string, frame: number } | null {
    const { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight } = neighbors
    
    const cardinalCount = this.countCardinalSand(neighbors)
    const diagonalCount = this.countDiagonalSand(neighbors)

    // If no adjacent sand at all, no ledge needed on this grass tile
    if (cardinalCount === 0 && diagonalCount === 0) {
      return null
    }

    // Use INSET sheet when grass is mostly surrounded by sand (at least 2 cardinal + 1 diagonal)
    // This creates "island" or "peninsula" grass tiles
    if (cardinalCount >= 2 && diagonalCount >= 1) {
      
      // Map to LEDGE_INSET frames based on which directions are STILL GRASS (no sand)
      // These are the "dry" directions where the grass extends
      const grassTop = !top
      const grassBottom = !bottom
      const grassLeft = !left
      const grassRight = !right
      
      // Determine which corner is grass (has no cardinal sand)
      if (grassTop && grassLeft) {
        return { sheet: this.ledgeSheetKey, frame: LEDGE.BOTTOM_RIGHT }
      }
      if (grassTop && grassRight) {
        return { sheet: this.ledgeSheetKey, frame: LEDGE.BOTTOM_LEFT }
      }
      if (grassBottom && grassLeft) {
        return { sheet: this.ledgeSheetKey, frame: LEDGE.TOP_RIGHT }
      }
      if (grassBottom && grassRight) {
        return { sheet: this.ledgeSheetKey, frame: LEDGE.TOP_LEFT }
      }
      
      // If all cardinal directions have sand, check diagonals to determine which diagonal is grass
      if (cardinalCount === 4) {
        if (!topLeft) {
          return { sheet: this.insetSheetKey, frame: LEDGE_INSET.BOTTOM_RIGHT_INSET }
        }
        if (!topRight) {
          return { sheet: this.insetSheetKey, frame: LEDGE_INSET.BOTTOM_LEFT_INSET }
        }
        if (!bottomLeft) {
          return { sheet: this.insetSheetKey, frame: LEDGE_INSET.TOP_RIGHT_INSET }
        }
        if (!bottomRight) {
          return { sheet: this.insetSheetKey, frame: LEDGE_INSET.TOP_LEFT_INSET }
        }
      }
      
      // Default fallback for inset sheet
      return { sheet: this.insetSheetKey, frame: LEDGE_INSET.TOP_LEFT_INSET }
    }

    // Otherwise use LEDGE sheet (simple edge cases - sand on one side)
    
    // SINGLE CARDINAL DIRECTIONS - sand on one side
    if (top && !bottom && !left && !right) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.TOP_MIDDLE }
    }
    if (bottom && !top && !left && !right) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.BOTTOM_MIDDLE }
    }
    if (left && !right && !top && !bottom) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.MIDDLE_LEFT }
    }
    if (right && !left && !top && !bottom) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.MIDDLE_RIGHT }
    }

    // TWO CARDINAL DIRECTIONS (corners) - sand in two adjacent sides
    if (top && left && !right && !bottom) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.BOTTOM_RIGHT }
    }
    if (top && right && !left && !bottom) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.BOTTOM_LEFT }
    }
    if (bottom && left && !top && !right) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.TOP_RIGHT }
    }
    if (bottom && right && !top && !left) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.TOP_LEFT }
    }

    // DIAGONAL-ONLY SAND - sand only in diagonal corners
    if (topLeft && !top && !left) {
      return { sheet: this.insetSheetKey, frame: LEDGE_INSET.BOTTOM_RIGHT_INSET }
    }
    if (topRight && !top && !right) {
      return { sheet: this.insetSheetKey, frame: LEDGE_INSET.BOTTOM_LEFT_INSET }
    }
    if (bottomLeft && !bottom && !left) {
      return { sheet: this.insetSheetKey, frame: LEDGE_INSET.TOP_RIGHT_INSET }
    }
    if (bottomRight && !bottom && !right) {
      return { sheet: this.insetSheetKey, frame: LEDGE_INSET.TOP_LEFT_INSET }
    }

    // THREE CARDINAL DIRECTIONS - sand on three sides
    if (top && bottom && left && !right) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.MIDDLE_RIGHT }
    }
    if (top && bottom && right && !left) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.MIDDLE_LEFT }
    }
    if (top && left && right && !bottom) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.BOTTOM_MIDDLE }
    }
    if (bottom && left && right && !top) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.TOP_MIDDLE }
    }

    // ALL FOUR CARDINAL DIRECTIONS (completely surrounded by sand)
    if (top && bottom && left && right) {
      return { sheet: this.ledgeSheetKey, frame: LEDGE.CENTER }
    }

    // Default fallback
    return { sheet: this.ledgeSheetKey, frame: LEDGE.CENTER }
  }

  /**
   * Render ledges on grass tiles that border sand
   */
  public renderAll(
    renderTexture: Phaser.GameObjects.RenderTexture,
    baseMap: BaseTile[][]
  ): void {
    
    let grassCount = 0
    let grassWithSandCount = 0
    let ledgeCount = 0
    
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = baseMap[y][x]
        
        // Only check GRASS tiles - ledges are drawn on grass
        if (this.isGrass(tile)) {
          grassCount++
          const neighbors = this.getNeighbors(baseMap, x, y)
          const hasSandNeighbor = neighbors.top || neighbors.bottom || neighbors.left || neighbors.right ||
                                  neighbors.topLeft || neighbors.topRight || neighbors.bottomLeft || neighbors.bottomRight
          
          if (hasSandNeighbor) {
            grassWithSandCount++
          }
          
          const ledgeTile = this.getLedgeTileForGrass(neighbors, x, y)
          
          if (ledgeTile !== null) {
            renderTexture.drawFrame(
              ledgeTile.sheet,
              ledgeTile.frame,
              x * this.tileSize,
              y * this.tileSize
            )
            ledgeCount++
          }
        }
      }
    }
    
      
    if (ledgeCount === 0 && grassWithSandCount > 0) {
      console.warn(`[LedgeRenderer] ⚠️ Found ${grassWithSandCount} grass tiles with sand neighbors but drew 0 ledges! Check pattern matching.`)
    }
  }

  /**
   * Alternative method: render ledges as separate sprites
   */
  public renderAsSprites(
    container: Phaser.GameObjects.Group,
    baseMap: BaseTile[][]
  ): void {
    
    let grassCount = 0
    let grassWithSandCount = 0
    let ledgeCount = 0
    
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = baseMap[y][x]
        
        if (this.isGrass(tile)) {
          grassCount++
          const neighbors = this.getNeighbors(baseMap, x, y)
          const hasSandNeighbor = neighbors.top || neighbors.bottom || neighbors.left || neighbors.right ||
                                  neighbors.topLeft || neighbors.topRight || neighbors.bottomLeft || neighbors.bottomRight
          
          if (hasSandNeighbor) {
            grassWithSandCount++
          }
          
          const ledgeTile = this.getLedgeTileForGrass(neighbors, x, y)
          
          if (ledgeTile !== null) {
            const sprite = this.scene.add.sprite(
              x * this.tileSize + this.tileSize / 2,
              y * this.tileSize + this.tileSize / 2,
              ledgeTile.sheet,
              ledgeTile.frame
            )
            sprite.setOrigin(0.5, 0.5)
            container.add(sprite)
            ledgeCount++
          }
        }
      }
    }
  }

}