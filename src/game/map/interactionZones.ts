export interface InteractionZone {
  id: string
  type: 'about' | 'projects' | 'contact' | 'career' | 'placeholder'
  label: string
  tiles: Array<{ x: number; y: number }>
}

function rect(x1: number, y1: number, x2: number, y2: number): Array<{ x: number; y: number }> {
  const tiles: Array<{ x: number; y: number }> = []
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      tiles.push({ x, y })
    }
  }
  return tiles
}

export const INTERACTION_ZONES: InteractionZone[] = [
  {
    id: 'house-main',
    type: 'about',
    label: 'About Me [E]',
    // Full collision footprint of main house: cols 9–13, rows 7–10
    tiles: rect(9, 8, 13, 10),
  },
  {
    id: 'house-neighbor',
    type: 'placeholder',
    label: '??? [E]',
    // Full collision footprint of neighbor house: cols 19–23, rows 7–10
    tiles: rect(25, 8, 29, 10),
  },
  {
    id: 'lab',
    type: 'projects',
    label: 'Projects [E]',
    // Full collision footprint of lab: cols 9–13, rows 14–17
    tiles: rect(9, 15, 13, 17),
  },
  {
    id: 'mailbox',
    type: 'contact',
    label: 'Contact [E]',
    tiles: [{ x: 8, y: 11 }],
  },
  {
    id: 'north-path',
    type: 'career',
    label: 'Route 101 [E]',
    // centered three-column gap at top of collision map (matches provided collisionData)
    tiles: [
      { x: 18, y: 0 },
      { x: 19, y: 0 },
      { x: 20, y: 0 },
      { x: 18, y: 1 },
      { x: 19, y: 1 },
      { x: 20, y: 1 },
      
    ],
  },
]
