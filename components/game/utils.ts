import {Game} from "../../lib/game";
import {GameResponse} from "./types";

export const createGameResponse = (game: Game): GameResponse => ({
  field: game.field,
  currentPlayer: game.nextPlayer(),
  possibleCoords: game.possibleCoords(),
  winner: game.tryWinner(),
});