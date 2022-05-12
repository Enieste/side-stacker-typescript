import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Coords {
    x: Int!,
    y: Int!,
  }
  input CoordsInput {
    x: Int!,
    y: Int!,
  }
  type Game {
    field: [[Int]]!,
    currentPlayer: Int,
    possibleCoords: [Coords]!,
    winner: Int,
  }
  
  input MoveInput {
    player: Int,
    coords: CoordsInput,
  }

  type Query {
    game: Game,
  }
  type Mutation {
    makeMove(move: MoveInput!): Game,
    initGame: Game,
  }
  
`;