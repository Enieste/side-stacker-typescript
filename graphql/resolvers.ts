import {GameResponse, Move} from "../components/game/types";
import {getGame, initGame} from "../lib/game";
import {createGameResponse} from "../components/game/utils";
import {IExecutableSchemaDefinition} from "@graphql-tools/schema";
import {createPubSub} from "@graphql-yoga/node";

type PS = {
  "game": [GameResponse];
};

const pubSub = createPubSub<PS>();

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
      game.makeMove(m.move);
      const r = createGameResponse(game);
      pubSub.publish("game", r);
      return r;
    },
    initGame: (): GameResponse => {
      return createGameResponse(initGame())
    }
  },
  Subscription: {
    moveMade: {
      subscribe: () => pubSub.subscribe("game"),
      resolve: (payload) => payload,
    }
  }
}