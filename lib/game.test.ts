import { initialField, Game } from "./game";
import { Field, Player, X, Y} from "../components/game/types";

const a = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const horizontal = [
  [0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
] as Field;

const vertical = [
  [0, 0, 0, 0, 0, 0, 1],
  [2, 2, 2, 0, 0, 0, 1],
  [2, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 1, 1, 1],
  [2, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
] as Field;

const stalemate = [
  [1, 2, 1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1, 2, 1],
] as Field;

const stalemate2 = [
  [2, 1, 2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2, 1, 2],
] as Field;

const possibleCoordsForEmptyGame = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [6, 6],
];

const createMove = (player: Player, x: X, y: Y) => ({ player, coords: { x, y }});

describe('Game', () => {
  it('initialises', () => {
    const game = new Game(initialField());
  })

  describe("Possible coords", () => {
    it('for empty game', () => {
      const game = new Game(initialField());
      const possibleCoords = game.possibleCoords().map((cs) => [cs.x, cs.y]);
      expect(possibleCoords).toEqual(possibleCoordsForEmptyGame);
    });
    it('for stalemate', () => {
      const game = new Game(stalemate);
      const possibleCoords = game.possibleCoords().map((cs) => [cs.x, cs.y]);
      expect(possibleCoords).toEqual([]);
    })
  })

  describe("Move", () => {
    it("trivial move", () => {
      const game = new Game(initialField());
      const fieldAfterMove = game.makeMove(createMove(1, 0, 0));
      expect(fieldAfterMove[0][0]).toBe(1);
    });
    it("non-trivial move", () => {
      const game = new Game(initialField());
      const fieldAfterMove = game.makeMove(createMove(1, 6, 0));
      expect(fieldAfterMove[0][6]).toBe(1);
    })
    it("checks the right player", () => {
      const game = new Game(initialField());
      expect(() => game.makeMove(createMove(2, 6, 0))).toThrow();
    })
    it("makes two moves", () => {
      const game = new Game(initialField());
      const fieldAfterMove1 = game.makeMove(createMove(1, 6, 0));
      const fieldAfterMove2 = game.makeMove(createMove(2, 0, 0));
      expect(fieldAfterMove1[0][6]).toBe(1);
      expect(fieldAfterMove2[0][0]).toBe(2);
    })
  })

  describe("Winner", () => {
    it("has no winner", () => {
      const game = new Game(initialField());
      expect(game.tryWinner()).toBe(null);
    })
    it("has horizontal winner", () => {
      const game = new Game(horizontal);
      expect(game.tryWinner()).toBe(1);
    })
    it("has vertical winner", () => {
      const game = new Game(vertical);
      expect(game.tryWinner()).toBe(2);
    })
    it("has L diagonal winner", () => {
      const game = new Game(stalemate);
      expect(game.tryWinner()).toBe(2);
    })
    it("has R diagonal winner", () => {
      const game = new Game(stalemate2);
      expect(game.tryWinner()).toBe(1);
    })
  })
})