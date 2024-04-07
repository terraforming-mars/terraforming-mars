import {MarsBoard} from './boards/MarsBoard';
import {BoardName} from '../common/boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {IGame} from './IGame';
import {GameOptions} from './game/GameOptions';
import {GameId, isPlayerId, safeCast} from '../common/Types';
import {HellasBoard} from './boards/HellasBoard';
import {TharsisBoard} from './boards/TharsisBoard';
import {IPlayer} from './IPlayer';
import {Player} from './Player';
import {Color} from '../common/Color';
import {TileType} from '../common/TileType';
import {Random} from '../common/utils/Random';
import {ArabiaTerraBoard} from './boards/ArabiaTerraBoard';
import {VastitasBorealisBoard} from './boards/VastitasBorealisBoard';
import {SerializedGame} from './SerializedGame';
import {TerraCimmeriaBoard} from './boards/TerraCimmeriaBoard';
import {AmazonisBoard} from './boards/AmazonisBoard';
import {UnderworldExpansion} from './underworld/UnderworldExpansion';
import {UtopiaPlanitiaBoard} from './boards/UtopiaPlanitiaBoard';
import {VastitasBorealisNovusBoard} from './boards/VastitasBorealisNovusBoard';
import {TerraCimmeriaNovusBoard} from './boards/TerraCimmeriaNovusBoard';
import {Board} from './boards/Board';
import {Space} from './boards/Space';

type BoardFactory = (new (spaces: ReadonlyArray<Space>) => MarsBoard) & {newInstance: (gameOptions: GameOptions, rng: Random) => MarsBoard};

const boards: Record<BoardName, BoardFactory> = {
  [BoardName.THARSIS]: TharsisBoard,
  [BoardName.HELLAS]: HellasBoard,
  [BoardName.ELYSIUM]: ElysiumBoard,
  [BoardName.UTOPIA_PLANITIA]: UtopiaPlanitiaBoard,
  [BoardName.VASTITAS_BOREALIS_NOVUS]: VastitasBorealisNovusBoard,
  [BoardName.TERRA_CIMMERIA_NOVUS]: TerraCimmeriaNovusBoard,
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
    const deserialized = Board.deserialize(d.board, playersForBoard).spaces;
    const Factory: BoardFactory = boards[gameOptions.boardName];
    return new Factory(deserialized);
  }

  public static neutralPlayerFor(gameId: GameId): IPlayer {
    const playerId = safeCast('p-' + gameId + '-neutral', isPlayerId);
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
