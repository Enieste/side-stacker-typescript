export interface Move {
  player: Player;
  coords: Coords;
}

export interface Coords {
  x: X;
  y: Y;
}

export type Player = 1|2;
export type X = 0|1|2|3|4|5|6;
export type Y = 0|1|2|3|4|5|6;
export type Empty = 0;
export type Cell = Player | Empty;
export type Field = Cell[][];

export type PossibleCoords = Coords[];

export interface GameResponse {
  field: Field,
  currentPlayer: Player,
  possibleCoords: PossibleCoords,
  winner: Player | null,
}