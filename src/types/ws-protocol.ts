export interface PlayerState {
  id: string
  username: string
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean
}

export type ClientMessage =
  | { type: 'JOIN'; payload: { username: string } }
  | { type: 'PLAYER_MOVE'; payload: Pick<PlayerState, 'x' | 'y' | 'direction' | 'isMoving'> }
  | { type: 'CHAT'; payload: { message: string } }
  | { type: 'PING'; payload: { t: number } }

export type ServerMessage =
  | { type: 'ROOM_STATE'; payload: { players: PlayerState[]; yourId: string } }
  | { type: 'PLAYER_JOIN'; payload: PlayerState }
  | { type: 'PLAYER_MOVE'; payload: Pick<PlayerState, 'id' | 'x' | 'y' | 'direction' | 'isMoving'> }
  | { type: 'PLAYER_LEAVE'; payload: { id: string } }
  | { type: 'CHAT'; payload: { id: string; message: string } }
  | { type: 'PONG'; payload: { t: number; serverT: number } }
  | { type: 'ERROR'; payload: { code: string; message: string } }
