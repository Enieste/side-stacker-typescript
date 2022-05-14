import {Cell as CellType, Coords, Field, Move, Player, PossibleCoords} from "./types";

export interface FieldProps extends WithOnMove {
  field: Field,
  possibleCoords: PossibleCoords,
  currentPlayer: Player,
}

interface WithOnMove {
  onMove: (m: Move) => void,
  isMoveLoading: boolean,
  isFieldClickable: boolean,
}

interface Commons {
  cell: CellType,
  isPossible: boolean,
  currentPlayer: Player,
  coords: Coords,
  isFieldClickable: boolean, //todo move double
}
export interface CellProps extends Commons, WithOnMove {
}

export interface StyledCellProps extends Commons { }