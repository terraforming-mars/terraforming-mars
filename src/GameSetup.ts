import {Board} from './boards/Board';
import {BoardName} from './common/boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {Game, GameOptions} from './Game';
import {GameId} from './common/Types';
import {HellasBoard} from './boards/HellasBoard';
import {OriginalBoard} from './boards/OriginalBoard';
import {Player} from './Player';
import {Resources} from './common/Resources';
import {Color} from './common/Color';
import {TileType} from './common/TileType';
import {Random} from './Random';
import {ArabiaTerraBoard} from './boards/ArabiaTerraBoard';
import {VastitasBorealisBoard} from './boards/VastitasBorealisBoard';

export class GameSetup {
  // Function to construct the board and milestones/awards list
  public static newBoard(gameOptions: GameOptions, rng: Random): Board {
    switch (gameOptions.boardName) {
    case BoardName.ELYSIUM:
      return ElysiumBoard.newInstance(gameOptions, rng);
    case BoardName.HELLAS:
      return HellasBoard.newInstance(gameOptions, rng);
    case BoardName.ARABIA_TERRA:
      return ArabiaTerraBoard.newInstance(gameOptions, rng);
    case BoardName.VASTITAS_BOREALIS:
      return VastitasBorealisBoard.newInstance(gameOptions, rng);
    default:
      return OriginalBoard.newInstance(gameOptions, rng);
    }
  }

  public static setStartingProductions(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.TITANIUM, 1);
    player.addProduction(Resources.PLANTS, 1);
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.HEAT, 1);
  }

  public static neutralPlayerFor(gameId: GameId): Player {
    return new Player('neutral', Color.NEUTRAL, true, 0, gameId + '-neutral');
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
