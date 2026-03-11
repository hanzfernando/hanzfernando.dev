export const DECOR = {
  NONE: 0,
  FLOWER_BUSH: 1,
  // add more decor freely here
} as const

export type DecorTile = typeof DECOR[keyof typeof DECOR]

export const DECOR_MAP: DecorTile[][] = Array.from({ length: 32 }, () => 
  new Array(64).fill(0)
)

// Place decor here — completely independent of terrain/collision
// House 1 front (terrain anchor x=24, y=9)
DECOR_MAP[9][24] = DECOR.FLOWER_BUSH
DECOR_MAP[9][26] = DECOR.FLOWER_BUSH
DECOR_MAP[9][27] = DECOR.FLOWER_BUSH
DECOR_MAP[9][28] = DECOR.FLOWER_BUSH

// House 2 front (terrain anchor x=14, y=12)
DECOR_MAP[12][14] = DECOR.FLOWER_BUSH
DECOR_MAP[12][16] = DECOR.FLOWER_BUSH
DECOR_MAP[12][17] = DECOR.FLOWER_BUSH
DECOR_MAP[12][18] = DECOR.FLOWER_BUSH

// Greenhouse front (terrain anchor x=45, y=10)
DECOR_MAP[10][45] = DECOR.FLOWER_BUSH
DECOR_MAP[10][46] = DECOR.FLOWER_BUSH
DECOR_MAP[10][47] = DECOR.FLOWER_BUSH
DECOR_MAP[10][49] = DECOR.FLOWER_BUSH
DECOR_MAP[10][50] = DECOR.FLOWER_BUSH
DECOR_MAP[10][51] = DECOR.FLOWER_BUSH