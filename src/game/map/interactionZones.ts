export interface InteractionZone {
  id: string
  type: 'about' | 'projects' | 'contact' | 'career' | 'placeholder'
  label: string
  tiles: Array<{ x: number; y: number }>
}

export const INTERACTION_ZONES: InteractionZone[] = [
  {
    id: 'house-main',
    type: 'about',
    label: 'Home [E]',
    tiles: [{ x: 11, y: 10 }],
  },
  {
    id: 'house-neighbor',
    type: 'placeholder',
    label: '??? [E]',
    tiles: [{ x: 26, y: 10 }],
  },
  {
    id: 'lab',
    type: 'projects',
    label: 'Lab [E]',
    tiles: [{ x: 11, y: 16 }],
  },
  {
    id: 'mailbox',
    type: 'contact',
    label: 'Mailbox [E]',
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
      { x: 18, y: 2 },
      { x: 19, y: 2 },
      { x: 20, y: 2 },
    ],
  },
]
