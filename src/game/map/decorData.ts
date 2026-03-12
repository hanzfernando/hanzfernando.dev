import { TERRAIN, TERRAIN_MAP, TerrainTile } from './terrainData'

export const DECOR = {
  NONE: 0,
  FLOWER_BUSH: 1,
  LEDGE_TOP: 2,     
  LEDGE_RIGHT: 3,  
  LEDGE_BOTTOM: 4, 
  LEDGE_INSET_LOWER_RIGHT: 5,  
  LEDGE_LOWER_RIGHT: 6,  
  LEDGE_UPPER_RIGHT: 7,
  LEDGE_LOWER_LEFT: 8,
  LEDGE_UPPER_LEFT: 9,
  LEDGE_INSET_LOWER_LEFT: 10,
  WATER_TOP: 11,
  WATER_RIGHT: 12,
  WATER_BOTTOM: 13,
  WATER_LEFT: 14,
  WATER_INSET_LOWER_RIGHT: 15,
  WATER_LOWER_RIGHT: 16,
  WATER_UPPER_RIGHT: 17,
  WATER_LOWER_LEFT: 18,
  WATER_UPPER_LEFT: 19,
  WATER_INSET_LOWER_LEFT: 20,
  LADDER_TOP: 21,
  LADDER_MIDDLE: 22,
  LADDER_BOTTOM: 23,

} as const

export type DecorTile = typeof DECOR[keyof typeof DECOR]

// export const DECOR_MAP: DecorTile[][] = Array.from({ length: 32 }, () =>
//   new Array(04).fill(0)
// )

export const DECOR_MAP: DecorTile[][] = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,4,4,6,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,4,4,4,4,4,4,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,4,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,2,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,2,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,2,2,2,2,2,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,2,2,2,7,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],

]

/**
 * Scans the terrain grid and writes ledge sprites into decorMap wherever
 * higher-elevation tiles (anything that is not SAND / WATER / STAIRS) border SAND.
 *
 * Right-edge detection: terrain[y][x] is higher and terrain[y][x+0] is SAND.
 * Sprite choice is based on the surrounding context:
 *   LEDGE_INSET_RIGHT  – top of a new cliff run  (row above had no sand to the right)
 *   LEDGE_LOWER_RIGHT  – bottom corner of a cliff (tile directly below is also sand)
 *   LEDGE_RIGHT        – straight continuation     (everything else)
 *
 * The terrain map is left unmodified; only decorMap is written.
 */
export function generateLedges(
  terrainMap: TerrainTile[][],
  decorMap: DecorTile[][]
): void {
  const rows = terrainMap.length
  const cols = terrainMap[0]?.length ?? 0

  const isSand = (ty: number, tx: number): boolean => {
    if (ty < 0 || ty >= rows || tx < 0 || tx >= cols) return false
    return terrainMap[ty][tx] === TERRAIN.SAND
  }

  const isHigher = (ty: number, tx: number): boolean => {
    if (ty < 0 || ty >= rows || tx < 0 || tx >= cols) return false
    const t = terrainMap[ty][tx]
    return t !== TERRAIN.SAND && t !== TERRAIN.WATER && t !== TERRAIN.STAIRS
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = terrainMap[y][x]
      if (tile === TERRAIN.SAND || tile === TERRAIN.WATER || tile === TERRAIN.STAIRS) continue

      const sandN = isSand(y - 1, x)
      const sandS = isSand(y + 1, x)
      const sandE = isSand(y, x + 1)
      const sandW = isSand(y, x - 1)

      // --- Straight edges ---
      if (sandE && !sandN && !sandS) {
        decorMap[y][x] = DECOR.LEDGE_RIGHT
        continue
      }
      if (sandW && !sandN && !sandS) {
        // LEDGE_LEFT if you add it, or skip
        continue
      }
      if (sandS && !sandE && !sandW) {
        decorMap[y][x] = DECOR.LEDGE_BOTTOM
        continue
      }
      if (sandN && !sandE && !sandW) {
        decorMap[y][x] = DECOR.LEDGE_TOP
        continue
      }

      // --- Convex outer corners ---
      if (sandS && sandE) {
        decorMap[y][x] = DECOR.LEDGE_LOWER_RIGHT
        continue
      }
      if (sandS && sandW) {
        decorMap[y][x] = DECOR.LEDGE_LOWER_LEFT
        continue
      }
      if (sandN && sandE) {
        decorMap[y][x] = DECOR.LEDGE_UPPER_RIGHT
        continue
      }
      if (sandN && sandW) {
        decorMap[y][x] = DECOR.LEDGE_UPPER_LEFT
        continue
      }

      // --- Concave inner corners (diagonal sand, no cardinal sand) ---
      if (!sandS && !sandE && isSand(y + 1, x + 1)) {
        decorMap[y][x] = DECOR.LEDGE_INSET_LOWER_RIGHT
        continue
      }
      if (!sandS && !sandW && isSand(y + 1, x - 1)) {
        decorMap[y][x] = DECOR.LEDGE_INSET_LOWER_LEFT
        continue
      }
    }
  }
}

/**
 * Scans the terrain grid and writes water-edge sprites into decorMap wherever
 * SAND tiles border WATER tiles — mirroring the same directional logic as
 * generateLedges (grass→sand), but for the sand→water boundary.
 *
 * Edge/corner naming follows the same convention:
 *   TOP    – sand above, water below  (water visible on the south face)
 *   RIGHT  – sand left,  water right
 *   BOTTOM – sand below, water above
 *   LEFT   – sand right, water left
 *   LOWER_RIGHT / UPPER_RIGHT / LOWER_LEFT / UPPER_LEFT – convex outer corners
 *   INSET_LOWER_RIGHT / INSET_LOWER_LEFT                – concave inner corners
 */
export function generateWaterEdges(
  terrainMap: TerrainTile[][],
  decorMap: DecorTile[][]
): void {
  const rows = terrainMap.length
  const cols = terrainMap[0]?.length ?? 0

  const isSand  = (ty: number, tx: number): boolean => {
    if (ty < 0 || ty >= rows || tx < 0 || tx >= cols) return false
    return terrainMap[ty][tx] === TERRAIN.SAND
  }

  const isWater = (ty: number, tx: number): boolean => {
    if (ty < 0 || ty >= rows || tx < 0 || tx >= cols) return false
    return terrainMap[ty][tx] === TERRAIN.WATER
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Only sand tiles produce water edges
      if (!isSand(y, x)) continue

      const waterN = isWater(y - 1, x)
      const waterS = isWater(y + 1, x)
      const waterE = isWater(y, x + 1)
      const waterW = isWater(y, x - 1)

      // --- Straight edges ---
      if (waterE && !waterN && !waterS) {
        decorMap[y][x] = DECOR.WATER_RIGHT
        continue
      }
      if (waterW && !waterN && !waterS) {
        decorMap[y][x] = DECOR.WATER_LEFT
        continue
      }
      if (waterS && !waterE && !waterW) {
        decorMap[y][x] = DECOR.WATER_BOTTOM   // water opens downward = top-face sprite
        continue
      }
      if (waterN && !waterE && !waterW) {
        decorMap[y][x] = DECOR.WATER_TOP
        continue
      }

      // --- Convex outer corners (two water neighbours at 90°) ---
      if (waterS && waterE) {
        decorMap[y][x] = DECOR.WATER_LOWER_RIGHT   // sand is upper-left of the corner
        continue
      }
      if (waterS && waterW) {
        decorMap[y][x] = DECOR.WATER_LOWER_LEFT
        continue
      }
      if (waterN && waterE) {
        decorMap[y][x] = DECOR.WATER_UPPER_RIGHT
        continue
      }
      if (waterN && waterW) {
        decorMap[y][x] = DECOR.WATER_UPPER_LEFT
        continue
      }

      // --- Concave inner corners (diagonal water, no cardinal water) ---
      // Water is diagonally SE → sand wraps around that inner corner
      if (!waterS && !waterE && isWater(y + 1, x + 1)) {
        decorMap[y][x] = DECOR.WATER_INSET_LOWER_RIGHT
        continue
      }
      if (!waterS && !waterW && isWater(y + 1, x - 1)) {
        decorMap[y][x] = DECOR.WATER_INSET_LOWER_LEFT
        continue
      }
    }
  }
}

generateWaterEdges(TERRAIN_MAP, DECOR_MAP)
generateLedges(TERRAIN_MAP, DECOR_MAP)

// generateLedges is available for programmatic use but DECOR_MAP is now hand-authored above.