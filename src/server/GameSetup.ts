import {Board} from './boards/Board';
import {BoardName} from '../common/boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {Game} from './Game';
import {GameOptions} from './GameOptions';
import {GameId, PlayerId} from '../common/Types';
import {HellasBoard} from './boards/HellasBoard';
import {OriginalBoard} from './boards/OriginalBoard';
import {Player} from './Player';
import {Color} from '../common/Color';
import {TileType} from '../common/TileType';
import {Random} from './Random';
import {ArabiaTerraBoard} from './boards/ArabiaTerraBoard';
import {VastitasBorealisBoard} from './boards/VastitasBorealisBoard';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedGame} from './SerializedGame';
import {TerraCimmeriaBoard} from './boards/TerraCimmeriaBoard';
import {AmazonisBoard} from './boards/AmazonisBoard';

type BoardFactory = {
  newInstance: (gameOptions: GameOptions, rng: Random) => Board;
  deserialize: (board: SerializedBoard, players: Array<Player>) => Board;
}
const boards: Map<BoardName, BoardFactory> = new Map(
  [[BoardName.ORIGINAL, OriginalBoard],
    [BoardName.HELLAS, HellasBoard],
    [BoardName.ELYSIUM, ElysiumBoard],
    [BoardName.AMAZONIS, AmazonisBoard],
    [BoardName.ARABIA_TERRA, ArabiaTerraBoard],
    [BoardName.TERRA_CIMMERIA, TerraCimmeriaBoard],
    [BoardName.VASTITAS_BOREALIS, VastitasBorealisBoard]],
);
export class GameSetup {
  public static newBoard(gameOptions: GameOptions, rng: Random): Board {
    const factory = boards.get(gameOptions.boardName) ?? OriginalBoard;
    return factory.newInstance(gameOptions, rng);
  }

  public static deserializeBoard(players: Array<Player>, gameOptions: GameOptions, d: SerializedGame) {
    const playersForBoard = players.length !== 1 ? players : [players[0], GameSetup.neutralPlayerFor(d.id)];
    const factory = boards.get(gameOptions.boardName) ?? OriginalBoard;
    return factory.deserialize(d.board, playersForBoard);
  }

  public static neutralPlayerFor(gameId: GameId): Player {
    const playerId = 'p-' + gameId + '-neutral' as PlayerId;
    return new Player('neutral', Color.NEUTRAL, true, 0, playerId);
  }

  public static setupNeutralPlayer(game: Game) {
    // Single player add neutral player
    // put 2 neutrals cities on board with adjacent forest
    const neutral = this.neutralPlayerFor(game.id);

    function placeCityAndForest(game: Game, direction: -1 | 1) {
      const board = game.board;
      const citySpace = game.getSpaceByOffset(direction, TileType.CITY);
      game.simpleAddTile(neutral, citySpace, {tileType: TileType.CITY});
      const adjacentSpaces = board.getAdjacentSpaces(citySpace).filter((s) => game.board.canPlaceTile(s));
      if (adjacentSpaces.length === 0) {
        throw new Error('No space for forest');
      }
      let idx = game.discardForCost(1, TileType.GREENERY);
      idx = Math.max(idx-1, 0); // Some cards cost zero.
      const forestSpace = adjacentSpaces[idx%adjacentSpaces.length];
      game.simpleAddTile(neutral, forestSpace, {tileType: TileType.GREENERY});
    }

    placeCityAndForest(game, 1);
    placeCityAndForest(game, -1);
  }
}
