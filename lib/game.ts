import findIndex from "lodash/findIndex";
import findLastIndex from "lodash/findLastIndex";
import {Cell, Coords, Field, Move, Player, PossibleCoords, X, Y} from "../components/game/types";

const SIDE = 7;
const WIN_LEN = 4;

export const initialField = () => new Array(SIDE).fill(0).map(() => new Array(7).fill(0)) as Field;

const rowIteration = (side: number): Coords[][] => {
  const rows: Coords[][] = [];
  for (let y = 0; y < side; y++) {
    const row: Coords[] = [];
    for (let x = 0; x < side; x++) {
      row.push({x: x as X, y: y as Y});
    }
    rows.push(row);
  }
  return rows;
}

const columnIteration = (side: number): Coords[][] => {
  const columns: Coords[][] = [];
  for (let x = 0; x < side; x++) {
    const column: Coords[] = [];
    for (let y = 0; y < side; y++) {
      column.push({x: x as X, y: y as Y});
    }
    columns.push(column);
  }
  return columns;
}

const diagonalLIteration = (side: number): Coords[][] => {
  const diagonals: Coords[][] = [];
  for (let k = 0; k < side * 2 - 1; k++) {
    const diagonal: Coords[] = [];
    for (let j = 0; j < k + 1; j++) {
      let i = k - j;
      if (i < side && j < side) {
        diagonal.push({ x: i as X, y: j as Y })
      }
      diagonals.push(diagonal);
    }
  }
  return diagonals;
}

const diagonalRIteration = (side: number): Coords[][] => {
  const diagonals: Coords[][] = [];
  for (let k = 0; k < side * 2 - 1; k++) {
    const diagonal: Coords[] = [];
    for (let j = 0; j < k + 1; j++) {
      let i = k - j;
      if (i < side && j < side) {
        diagonal.push({ x: i as X, y: side - j - 1 as Y })
      }
      diagonals.push(diagonal);
    }
  }
  return diagonals;
}

export class Game {

  field:Field;

  constructor(field:Field) {
    this.field = field;
  }

  possibleCoords(): PossibleCoords {
    return this.field.map((row, rowIndex: Y) => {
      const firstIndex = findIndex(row, (x: X) => x === 0) as X;
      const lastIndex = findLastIndex(row, (x: X) => x === 0) as X;
      return [{x: firstIndex, y: rowIndex}, { x: lastIndex, y: rowIndex }];
    }).flat().filter(cs => cs.x !== -1 as any && cs.y !== -1 as any).sort((a, b) => a.x - b.x);
  }

  makeMove(move: Move) {
    if (this.tryWinner()) throw new Error(`The game has already ended`);
    if (move.player !== this.nextPlayer()) throw new Error(`It's not your turn player ${move.player}`);
    if (!this.areCoordsValid(move.coords)) throw new Error(`Move ${JSON.stringify(move.coords)} is not ACCEPTABLE`);
    this.field[move.coords.y][move.coords.x] = move.player;
    return this.field; // todo remove !tests
  }

  tryWinner(): Player|null {
    for (const f of [rowIteration, columnIteration, diagonalLIteration, diagonalRIteration]) {
      const coordsA = f(SIDE);
      for (let i = 0; i < coordsA.length; i++) {
        const coords = coordsA[i];
        let currentPlayer: Cell = 0;
        let currentCount = 0;
        for (let k = 0; k < coords.length; k++) {
          const {x, y} = coords[k];
          const player = this.field[y][x];
          if (currentPlayer && player === currentPlayer) {
            currentCount++;
          } else {
            currentPlayer = player;
            currentCount = 1;
          }
          let won = currentPlayer && currentCount >= WIN_LEN;
          if (won) return currentPlayer as Player;
        }
      }
    }
    return null;
  }

  nextPlayer(): Player {
    return this.field.flat().filter(v => v !== 0).length % 2 === 0 ? 1 : 2;
  }

  private areCoordsValid(coords: Coords) {
    return !!this.possibleCoords().find(cs => cs.x === coords.x && cs.y === coords.y);
  }
}

let game: Game;

export const initGame = () => {
  game = new Game(initialField());
  return game;
}

export const getGame = () => {
  return game;
};