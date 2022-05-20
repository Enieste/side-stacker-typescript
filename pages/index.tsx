import {StyledCell, Row} from "../components/game/styles";
import {CellProps, FieldProps} from "../components/game/componentTypes";
import { Coords, GameResponse, Move, PossibleCoords, X, Y} from "../components/game/types";
import {
  useQuery,
  useMutation
} from "@apollo/client";

import {omit} from "ramda";
import {GAME_SUBSCRIPTION, GET_GAME, INIT_GAME, MAKE_MOVE} from "../graphql/queries";
import {useEffect} from "react";

const cellKey = (x: X, y: Y) => x + "_" + y;

const isPossible = (cellCoords: Coords, possibleCoords: PossibleCoords): boolean => {
  const pcSet = new Set(possibleCoords.map(({x, y}) => cellKey(x, y)));
  return pcSet.has(cellKey(cellCoords.x, cellCoords.y));
}

const Cell = (props: CellProps) => {

  const handleClick = (): void => {
    if (!props.isPossible || props.isMoveLoading) return;
    props.onMove({
      coords: props.coords,
      player: props.currentPlayer,
    })
  }

  return (
    <StyledCell {...omit(["onMove"], props)} onClick={handleClick} />
  );
};

const Field = ({ field, possibleCoords, currentPlayer, onMove, isMoveLoading, isFieldClickable }: FieldProps) => {
  return (<div>
    {field.map((row, y: Y) => {
      return <Row key={y}>{row.map((cell, x: X) => <Cell
        cell={cell}
        isPossible={isPossible({ x, y }, possibleCoords)}
        key={cellKey(x, y)}
        currentPlayer={currentPlayer}
        onMove={onMove}
        isMoveLoading={isMoveLoading}
        isFieldClickable={isFieldClickable}
        coords={{ x, y }}
      />)}
      </Row>
    })}
  </div>)
};

const useGame = () => {
  const { subscribeToMore, ...others } = useQuery<{ game: GameResponse }>(GET_GAME);
  useEffect(() => {
    const unsubscribe = subscribeToMore<{ moveMade: GameResponse }>({
      document: GAME_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("subscriptionData", subscriptionData)
        if (!subscriptionData.data?.moveMade) return {
          game: null,
        };
        return {
          game: subscriptionData.data.moveMade,
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return others;
};

export default function Home() {

  const { loading: gameLoading, error: gameLoadingError, data: gameResponse } = useGame();
  const [initGameMutation, { loading: initGameLoading, error: initGameError }] = useMutation(INIT_GAME, {
    refetchQueries: [GET_GAME],
  });
  const [makeMoveMutation, { loading: moveLoading, error: moveError }] = useMutation<any, {move: Move}>(MAKE_MOVE, {
    refetchQueries: [GET_GAME],
  });

  const game = gameResponse?.game;
  const startNewGame = () => {
    initGameMutation();
  };

  const handleMove = async (move: Move) => {
    makeMoveMutation({
      variables: {
        move
      }
    });
  }

  const isFieldClickable = (): boolean => {
    if (game && game.winner) return false;
    // todo if the right player
    return true;
  }

  if (gameLoading) return <div>Loading...</div>;
  if (gameLoadingError) return <div>Game loading error {gameLoadingError.message}</div>;
  return <div>
    <button onClick={startNewGame}>
      New Game
    </button>
    { game && <Field
      field={game.field}
      possibleCoords={game.possibleCoords}
      currentPlayer={game.currentPlayer}
      onMove={handleMove}
      isMoveLoading={moveLoading}
      isFieldClickable={isFieldClickable()}
    /> }
    {game?.winner && <div>The winner is Player {game.winner}</div>}
  </div>
}
