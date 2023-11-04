import {MarsBoard} from './boards/MarsBoard';
import {BoardName} from '../common/boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {IGame} from './IGame';
import {GameOptions} from './game/GameOptions';
import {GameId, PlayerId} from '../common/Types';
import {HellasBoard} from './boards/HellasBoard';
import {TharsisBoard} from './boards/TharsisBoard';
import {IPlayer} from './IPlayer';
import {Player} from './Player';
import {Color} from '../common/Color';
import {TileType} from '../common/TileType';
import {Random} from '../common/utils/Random';
import {ArabiaTerraBoard} from './boards/ArabiaTerraBoard';
import {VastitasBorealisBoard} from './boards/VastitasBorealisBoard';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedGame} from './SerializedGame';
import {TerraCimmeriaBoard} from './boards/TerraCimmeriaBoard';
import {AmazonisBoard} from './boards/AmazonisBoard';
import {UnderworldExpansion} from './underworld/UnderworldExpansion';

type BoardFactory = {
  newInstance: (gameOptions: GameOptions, rng: Random) => MarsBoard;
  deserialize: (board: SerializedBoard, players: Array<IPlayer>) => MarsBoard;
};

const boards: Record<BoardName, BoardFactory> = {
  [BoardName.THARSIS]: TharsisBoard,
  [BoardName.HELLAS]: HellasBoard,
  [BoardName.ELYSIUM]: ElysiumBoard,
  [BoardName.AMAZONIS]: AmazonisBoard,
  [BoardName.ARABIA_TERRA]: ArabiaTerraBoard,
  [BoardName.TERRA_CIMMERIA]: TerraCimmeriaBoard,
  [BoardName.VASTITAS_BOREALIS]: VastitasBorealisBoard,
};

export class GameSetup {
  public static newBoard(gameOptions: GameOptions, rng: Random): MarsBoard {
    const factory = boards[gameOptions.boardName];
    return factory.newInstance(gameOptions, rng);
  }

  public static deserializeBoard(players: Array<IPlayer>, gameOptions: GameOptions, d: SerializedGame) {
    const playersForBoard = players.length !== 1 ? players : [players[0], GameSetup.neutralPlayerFor(d.id)];
    const factory: BoardFactory = boards[gameOptions.boardName];
    return factory.deserialize(d.board, playersForBoard);
  }

  public static neutralPlayerFor(gameId: GameId): IPlayer {
    const playerId = 'p-' + gameId + '-neutral' as PlayerId;
    return new Player('neutral', Color.NEUTRAL, true, 0, playerId);
  }

  public static setupNeutralPlayer(game: IGame) {
    // Single player add neutral player
    // put 2 neutrals cities on board with adjacent forest
    const neutral = this.neutralPlayerFor(game.id);

    function placeCityAndForest(game: IGame, direction: -1 | 1) {
      const board = game.board;
      const citySpace = game.getSpaceByOffset(direction, TileType.CITY);
      game.simpleAddTile(neutral, citySpace, {tileType: TileType.CITY});
      if (game.gameOptions.underworldExpansion === true) {
        UnderworldExpansion.identify(game, citySpace, undefined);
      }

      const adjacentSpaces = board.getAdjacentSpaces(citySpace).filter((s) => game.board.canPlaceTile(s));
      if (adjacentSpaces.length === 0) {
        throw new Error('No space for forest');
      }
      let idx = game.discardForCost(1, TileType.GREENERY);
      idx = Math.max(idx-1, 0); // Some cards cost zero.
      const greenerySpace = adjacentSpaces[idx%adjacentSpaces.length];
      game.simpleAddTile(neutral, greenerySpace, {tileType: TileType.GREENERY});
      if (game.gameOptions.underworldExpansion === true) {
        UnderworldExpansion.identify(game, greenerySpace, undefined);
      }
    }

    placeCityAndForest(game, 1);
    placeCityAndForest(game, -1);
  }
}
