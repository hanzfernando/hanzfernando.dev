export const TILE_SIZE = 16
export const MAP_WIDTH = 39
export const MAP_HEIGHT = 24
export const MOVE_DURATION_MS = 180
export const SPAWN_TILE_X = 18
export const SPAWN_TILE_Y = 12
export const EMIT_INTERVAL_MS = 50
export const INTERPOLATION_BUFFER = 2

// Sprite sheets: char-1-sprite.png … char-4-sprite.png
// Each sheet: 4 columns × 4 rows (4 animation frames per direction)
// Row order: 0 = down, 1 = up, 2 = left, 3 = right
export const SPRITE_FRAME_W = 15
export const SPRITE_FRAME_H = 22
export const SPRITE_COLS = 4   // frames per direction
export const SPRITE_ROWS = 4   // directions
export const CHAR_COUNT = 4    // number of selectable characters

// Direction → row index mapping (matches your sheet row order)
export const DIR_ROW: Record<string, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
}

// Texture key for a given character index (0-based)
export function charSheetKey(index: number): string {
  return `char-${index + 1}-sheet`
}
