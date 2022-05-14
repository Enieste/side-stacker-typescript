import {GameResponse, Move} from "../components/game/types";
import {getGame, initGame} from "../lib/game";
import {createGameResponse} from "../components/game/utils";
import {IExecutableSchemaDefinition} from "@graphql-tools/schema";

export const resolvers = {
  Query: {
    game: (): GameResponse => {
      const game = getGame();
      return game ? createGameResponse(game) : null;
    },
  },
  Mutation: {
    makeMove: (_: any, m: { move: Move }): GameResponse => {
      const game = getGame();
      console.log("MOVE", m.move);
      game.makeMove(m.move);
      return createGameResponse(game);
    },
    initGame: (): GameResponse => {
      return createGameResponse(initGame())
    }
  },
  Subscription: {
    moveMade: {
      subscribe: async function* () {
        for await (const word of ["Hello", "Bonjour", "Ciao"]) {
          yield getGame();
        }
      },
    }
  }
}