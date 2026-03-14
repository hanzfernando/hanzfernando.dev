import Phaser from 'phaser'

/**
 * PathAutotiler
 * ─────────────────────────────────────────────────────────────────────────────
 * Autotiles a path spritesheet based on cardinal neighbours.
 * All 16 bitmask cases are covered by the 9 frames directly — no flipping.
 *
 * ── path-sheet (3×3, 9 frames) ───────────────────────────────────────────────
 *
 *   ┌──┬──┬──┐
 *   │0 │1 │2 │  TL · TE · TR
 *   ├──┼──┼──┤
 *   │3 │4 │5 │  LE · IN · RE
 *   ├──┼──┼──┤
 *   │6 │7 │8 │  BL · BE · BR
 *   └──┴──┴──┘
 *
 * ── path-inset (2×2, 4 frames) ───────────────────────────────────────────────
 *
 *   ┌──┬──┐
 *   │0 │1 │  inset-NW · inset-NE
 *   ├──┼──┤
 *   │2 │3 │  inset-SW · inset-SE
 *   └──┴──┘
 *
 *   Inset frames overlay interior cells (mask=15) when a diagonal neighbour
 *   is not a path tile, producing a concave inner corner.
 *
 * ── Bitmask ───────────────────────────────────────────────────────────────────
 *
 *   Cardinal:  N=1  E=2  S=4  W=8
 *
 * ── Performance notes ────────────────────────────────────────────────────────
 *
 *   • drawAll() does a single O(n) pass — call it ONCE, outside any loop.
 *   • The stamp RT has been removed; rt.drawFrame() is used directly, which
 *     is faster because it avoids an extra blit per tile.
 *   • cardinalMask() uses a pre-built Uint8Array for O(1) neighbour lookups
 *     instead of repeated bounds checks in the hot path.
 *   • No GameObjects are created or destroyed per tile.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type DiagonalDef = {
  offset: [number, number]  // [dy, dx]
  insetFrame: number        // 0=NW  1=NE  2=SW  3=SE
}

// ─── Cardinal map (no flips — all 16 cases use direct frames) ─────────────────
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
  4, // 15 all neighbours (check diagonals)
])

// ─── Diagonal inset definitions ───────────────────────────────────────────────
const DIAGONALS: DiagonalDef[] = [
  { offset: [-1, -1], insetFrame: 0 }, // NW absent → inset-NW
  { offset: [-1, +1], insetFrame: 1 }, // NE absent → inset-NE
  { offset: [+1, -1], insetFrame: 2 }, // SW absent → inset-SW
  { offset: [+1, +1], insetFrame: 3 }, // SE absent → inset-SE
]

// ─── Config ───────────────────────────────────────────────────────────────────

export type PathAutotilerConfig = {
  /** Texture key for the 3×3 sheet (9 frames of tileSize×tileSize). */
  sheetKey: string
  /** Texture key for the 2×2 inset sheet (4 frames of tileSize×tileSize). */
  insetKey: string
  /** Tile size in pixels. Must match spritesheet frame dimensions. Default 16. */
  tileSize?: number
}

// ─── PathAutotiler ────────────────────────────────────────────────────────────

export class PathAutotiler {
  private readonly sheetKey: string
  private readonly insetKey: string
  private readonly tileSize: number

  // Cached flat lookup array: 1 if path, 0 otherwise.
  // Built once in drawAll() so hot-path isPath checks are O(1) array reads.
  private maskCache: Uint8Array = new Uint8Array(0)
  private cacheRows = 0
  private cacheCols = 0

  constructor(_scene: Phaser.Scene, config: PathAutotilerConfig) {
    this.sheetKey = config.sheetKey
    this.insetKey = config.insetKey
    this.tileSize = config.tileSize ?? 16
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Draw every path tile in `map` into `rt` in a single O(n) pass.
   *
   * ⚠️  Call this ONCE per render, OUTSIDE any loop over other tile types.
   *     Calling it inside a per-tile loop causes O(n²) redundant work.
   */
  drawAll(
    rt: Phaser.GameObjects.RenderTexture,
    map: number[][],
    pathValue: number,
  ): void {
    const rows = map.length
    const cols = map[0]?.length ?? 0

    // Build a flat Uint8Array so neighbour lookups are a single array read
    // with no object property chains or bounds-check branches in the hot path.
    if (this.maskCache.length !== rows * cols) {
      this.maskCache = new Uint8Array(rows * cols)
      this.cacheRows = rows
      this.cacheCols = cols
    }

    for (let y = 0; y < rows; y++) {
      const row = map[y]
      const base = y * cols
      for (let x = 0; x < cols; x++) {
        this.maskCache[base + x] = row[x] === pathValue ? 1 : 0
      }
    }

    // Single pass: draw only path tiles
    for (let y = 0; y < rows; y++) {
      const base = y * cols
      for (let x = 0; x < cols; x++) {
        if (this.maskCache[base + x] === 1) {
          this.drawTileInternal(rt, x, y)
        }
      }
    }
  }

  /**
   * Draw a single path tile into `rt` at grid position (tileX, tileY).
   * Useful for incremental redraws. Requires drawAll() to have been called
   * first so the mask cache is populated.
   */
  drawTile(
    rt: Phaser.GameObjects.RenderTexture,
    map: number[][],
    pathValue: number,
    tileX: number,
    tileY: number,
  ): void {
    // Rebuild cache if it's stale (e.g. map changed)
    const rows = map.length
    const cols = map[0]?.length ?? 0
    if (this.maskCache.length !== rows * cols) {
      this.drawAll(rt, map, pathValue)
      return
    }
    this.drawTileInternal(rt, tileX, tileY)
  }

  /** Release resources. Call from your scene's shutdown(). */
  destroy(): void {
    // Nothing to release — we removed the stamp RT.
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /** Inner draw — assumes maskCache is already populated. */
  private drawTileInternal(
    rt: Phaser.GameObjects.RenderTexture,
    x: number,
    y: number,
  ): void {
    const px   = x * this.tileSize
    const py   = y * this.tileSize
    const mask = this.cardinalMask(x, y)

    rt.drawFrame(this.sheetKey, CARDINAL_FRAMES[mask], px, py)

    // Inset overlays only for fully-surrounded interior tiles
    if (mask === 15) {
      for (const { offset: [dy, dx], insetFrame } of DIAGONALS) {
        if (!this.isCachedPath(x + dx, y + dy)) {
          rt.drawFrame(this.insetKey, insetFrame, px, py)
        }
      }
    }
  }

  /** O(1) neighbour check against the flat cache. */
  private isCachedPath(x: number, y: number): boolean {
    if (x < 0 || y < 0 || y >= this.cacheRows || x >= this.cacheCols) return false
    return this.maskCache[y * this.cacheCols + x] === 1
  }

  private cardinalMask(x: number, y: number): number {
    let mask = 0
    if (this.isCachedPath(x,     y - 1)) mask |= 1 // N
    if (this.isCachedPath(x + 1, y    )) mask |= 2 // E
    if (this.isCachedPath(x,     y + 1)) mask |= 4 // S
    if (this.isCachedPath(x - 1, y    )) mask |= 8 // W
    return mask
  }
}