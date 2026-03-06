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
    tiles: [{ x: 21, y: 10 }],
  },
  {
    id: 'lab',
    type: 'projects',
    label: 'Lab [E]',
    tiles: [{ x: 11, y: 17 }],
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
    tiles: [{ x: 15, y: 0 }, { x: 16, y: 0 }, { x: 17, y: 0 }, { x: 15, y: 1 }, { x: 16, y: 1 }, { x: 17, y: 1 }, { x: 15, y: 2 }, { x: 16, y: 2 }, { x: 17, y: 2 }],
  },
]
