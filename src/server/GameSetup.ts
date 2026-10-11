import {MarsBoard} from './boards/MarsBoard';
import {BoardName} from '../common/boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {IGame} from './IGame';
import {GameOptions} from './game/GameOptions';
import {GameId, SpaceId, isPlayerId, safeCast} from '../common/Types';
import {SpaceType} from '../common/boards/SpaceType';
import {SerializedBoard} from './boards/SerializedBoard';
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
import {VastitasBorealisNovaBoard} from './boards/VastitasBorealisNovaBoard';
import {TerraCimmeriaNovaBoard} from './boards/TerraCimmeriaNovaBoard';
import {Board} from './boards/Board';
import {Space} from './boards/Space';
import {HollandiaBoard} from './boards/HollandiaBoard';
import {AmazonisPlanitiaBoard} from './boards/AmazonisPlanitiaBoard';

type BoardFactory = (new (spaces: ReadonlyArray<Space>) => MarsBoard) & {newInstance: (gameOptions: GameOptions, rng: Random) => MarsBoard};

// When renaming a board, add the old name here so saved games can still be loaded.
const BOARD_RENAMES = new Map<string, BoardName>([
  ['vastitas borealis novus', BoardName.VASTITAS_BOREALIS_NOVA],
  ['terra cimmeria novus', BoardName.TERRA_CIMMERIA_NOVA],
]);

export function normalizeBoardName(name: string): BoardName {
  return BOARD_RENAMES.get(name) ?? name as BoardName;
}

const boards: Record<BoardName, BoardFactory> = {
  [BoardName.THARSIS]: TharsisBoard,
  [BoardName.HELLAS]: HellasBoard,
  [BoardName.ELYSIUM]: ElysiumBoard,
  [BoardName.UTOPIA_PLANITIA]: UtopiaPlanitiaBoard,
  [BoardName.VASTITAS_BOREALIS_NOVA]: VastitasBorealisNovaBoard,
  [BoardName.TERRA_CIMMERIA_NOVA]: TerraCimmeriaNovaBoard,
  [BoardName.AMAZONIS]: AmazonisBoard,
  [BoardName.ARABIA_TERRA]: ArabiaTerraBoard,
  [BoardName.TERRA_CIMMERIA]: TerraCimmeriaBoard,
  [BoardName.VASTITAS_BOREALIS]: VastitasBorealisBoard,
  [BoardName.HOLLANDIA]: HollandiaBoard,
  [BoardName.AMAZONIS_PLANITIA]: AmazonisPlanitiaBoard,
} satisfies Record<BoardName, BoardFactory>;

export class GameSetup {
  public static newBoard(gameOptions: GameOptions, rng: Random): MarsBoard {
    const factory = boards[gameOptions.boardName];
    return factory.newInstance(gameOptions, rng);
  }

  public static deserializeBoard(players: Array<IPlayer>, gameOptions: GameOptions, d: SerializedGame) {
    const playersForBoard = players.length !== 1 ? players : [players[0], GameSetup.neutralPlayerFor(d.id)];
    migrateColonySpaceIds(d.board);
    migrateEdges(d.board, gameOptions.boardName);
    const deserialized = Board.deserialize(d.board, playersForBoard).spaces;
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

// TODO(kberg): Remove after 2028-01-01
// Mars colony spaces used to have bare two-digit ids ('01', '02', '69'-'78'). They now lead with 'c'.
function migrateColonySpaceIds(board: SerializedBoard): void {
  for (const space of board.spaces) {
    if (space.spaceType === SpaceType.COLONY && !space.id.startsWith('c')) {
      space.id = `c${space.id}` as SpaceId;
    }
  }
}

// TODO(kberg): Remove after 2026-12-01
// Spaces used to have no edge attribute. Every 61-space board shares the same edges.
// Amazonis Planitia is excluded because it postdates the edge attribute.
const LEGACY_EDGES: ReadonlyArray<string> = [
  '03', '04', '05', '06', '07',
  '08', '13',
  '14', '20',
  '21', '28',
  '29', '37',
  '38', '45',
  '46', '52',
  '53', '58',
  '59', '60', '61', '62', '63',
];
function migrateEdges(board: SerializedBoard, boardName: BoardName): void {
  if (boardName === BoardName.AMAZONIS_PLANITIA) {
    return;
  }
  if (board.spaces.find((space) => space.id === '03')?.edge === true) {
    return;
  }
  for (const space of board.spaces) {
    if (LEGACY_EDGES.includes(space.id)) {
      space.edge = true;
    }
  }
}
