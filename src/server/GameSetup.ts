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
import {TileType} from '../common/TileType';
import {Random} from '../common/utils/Random';
import {ArabiaTerraBoard} from './boards/ArabiaTerraBoard';
import {VastitasBorealisBoard} from './boards/VastitasBorealisBoard';
import {SerializedGame} from './SerializedGame';
import {TerraCimmeriaBoard} from './boards/TerraCimmeriaBoard';
import {AmazonisBoard} from './boards/AmazonisBoard';
import {UtopiaPlanitiaBoard} from './boards/UtopiaPlanitiaBoard';
import {VastitasBorealisNovusBoard} from './boards/VastitasBorealisNovusBoard';
import {TerraCimmeriaNovusBoard} from './boards/TerraCimmeriaNovusBoard';
import {Board} from './boards/Board';
import {Space} from './boards/Space';
import {Hollandia} from './boards/Hollandia';

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
  [BoardName.HOLLANDIA]: Hollandia,
};

export class GameSetup {
  public static newBoard(gameOptions: GameOptions, rng: Random): MarsBoard {
    const factory = boards[gameOptions.boardName];
    return factory.newInstance(gameOptions, rng);
  }

  public static deserializeBoard(players: Array<IPlayer>, gameOptions: GameOptions, d: SerializedGame) {
    const playersForBoard = players.length !== 1 ? players : [players[0], GameSetup.neutralPlayerFor(d.id)];
    const deserialized = Board.deserialize(d.board, playersForBoard).spaces;
    // TODO(kberg): Remove after 2025-10-25
    if (gameOptions.boardName === 'Hollandia regels' as any) {
      gameOptions.boardName = BoardName.HOLLANDIA;
    }
    const Factory: BoardFactory = boards[gameOptions.boardName];
    return new Factory(deserialized);
  }

  public static neutralPlayerFor(gameId: GameId): IPlayer {
    const playerId = safeCast('p-' + gameId + '-neutral', isPlayerId);
    return new Player('neutral', 'neutral', true, 0, playerId);
  }

  public static setupNeutralPlayer(game: IGame) {
    // Single player add neutral player
    // put 2 neutrals cities on board with adjacent forest
    const neutral = this.neutralPlayerFor(game.id);

    function placeCityAndForest(game: IGame, direction: 'top' | 'bottom') {
      const board = game.board;

      const cost = game.discardForCost(1, TileType.CITY);

      const distance = Math.max(cost - 1, 0); // Some cards cost zero.
      const citySpace = board.getNthAvailableLandSpace(distance, direction,
        (space) => {
          const adjacentSpaces = board.getAdjacentSpaces(space);
          return adjacentSpaces.every((sp) => sp.tile?.tileType !== TileType.CITY) && // no cities nearby
              adjacentSpaces.some((sp) => board.canPlaceTile(sp)); // can place forest nearby
        });
      game.simpleAddTile(neutral, citySpace, {tileType: TileType.CITY});

      const adjacentSpaces = board.getAdjacentSpaces(citySpace).filter((s) => game.board.canPlaceTile(s));
      if (adjacentSpaces.length === 0) {
        throw new Error('No space for forest');
      }
      let idx = game.discardForCost(1, TileType.GREENERY);
      idx = Math.max(idx-1, 0); // Some cards cost zero.
      const greenerySpace = adjacentSpaces[idx%adjacentSpaces.length];
      game.simpleAddTile(neutral, greenerySpace, {tileType: TileType.GREENERY});
    }

    placeCityAndForest(game, 'top');
    placeCityAndForest(game, 'bottom');
  }
}
