import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from './awards/Awards';
import {Board} from './boards/Board';
import {BoardName} from './boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {Game, GameId, GameOptions} from './Game';
import {HellasBoard} from './boards/HellasBoard';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from './milestones/Milestones';
import {OriginalBoard} from './boards/OriginalBoard';
import {RandomMAOptionType} from './RandomMAOptionType';
import {getRandomMilestonesAndAwards} from './MilestoneAwardSelector';
import {IDrawnMilestonesAndAwards} from './IDrawnMilestonesAndAwards';
import {Player} from './Player';
import {Resources} from './Resources';
import {ColonyName} from './colonies/ColonyName';
import {Color} from './Color';
import {AresSetup} from './ares/AresSetup';
import {TileType} from './TileType';
import {Random} from './Random';

export class GameSetup {
  public static chooseMilestonesAndAwards = function(gameOptions: GameOptions): IDrawnMilestonesAndAwards {
    let drawnMilestonesAndAwards: IDrawnMilestonesAndAwards = {
      milestones: [],
      awards: [],
    };

    const includeVenus = gameOptions.venusNextExtension && gameOptions.includeVenusMA;
    const requiredQty = includeVenus ? 6 : 5;

    switch (gameOptions.randomMA) {
    case RandomMAOptionType.NONE:
      switch (gameOptions.boardName) {
      case BoardName.ORIGINAL:
        drawnMilestonesAndAwards.milestones.push(...ORIGINAL_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...ORIGINAL_AWARDS);
        break;
      case BoardName.HELLAS:
        drawnMilestonesAndAwards.milestones.push(...HELLAS_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...HELLAS_AWARDS);
        break;
      case BoardName.ELYSIUM:
        drawnMilestonesAndAwards.milestones.push(...ELYSIUM_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...ELYSIUM_AWARDS);
        break;
      }
      if (includeVenus) {
        drawnMilestonesAndAwards.milestones.push(...VENUS_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...VENUS_AWARDS);
      }

      break;
    case RandomMAOptionType.LIMITED:
      drawnMilestonesAndAwards = getRandomMilestonesAndAwards(includeVenus, requiredQty);
      break;
    case RandomMAOptionType.UNLIMITED:
      drawnMilestonesAndAwards = getRandomMilestonesAndAwards(includeVenus, requiredQty, 100, 100, 100, 100);
      break;
    }

    if (gameOptions.aresExtension) {
      AresSetup.setupMilestonesAwards(drawnMilestonesAndAwards);
    };
    return drawnMilestonesAndAwards;
  };

  // Function to construct the board and milestones/awards list
  public static newBoard(boardName: BoardName, shuffle: boolean, rng: Random, includeVenus: boolean): Board {
    if (boardName === BoardName.ELYSIUM) {
      return ElysiumBoard.newInstance(shuffle, rng, includeVenus);
    } else if (boardName === BoardName.HELLAS) {
      return HellasBoard.newInstance(shuffle, rng, includeVenus);
    } else {
      return OriginalBoard.newInstance(shuffle, rng, includeVenus);
    }
  }

  public static setStartingProductions(player: Player) {
    player.addProduction(Resources.MEGACREDITS);
    player.addProduction(Resources.STEEL);
    player.addProduction(Resources.TITANIUM);
    player.addProduction(Resources.PLANTS);
    player.addProduction(Resources.ENERGY);
    player.addProduction(Resources.HEAT);
  }

  public static includesCommunityColonies(gameOptions: GameOptions) : boolean {
    if (!gameOptions.customColoniesList) return false;
    if (gameOptions.customColoniesList.includes(ColonyName.IAPETUS)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.MERCURY)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.HYGIEA)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.TITANIA)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.VENUS)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.LEAVITT)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.PALLAS)) return true;

    return false;
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
      let idx = game.discardForCost(TileType.GREENERY);
      idx = Math.max(idx-1, 0); // Some cards cost zero.
      const forestSpace = adjacentSpaces[idx%adjacentSpaces.length];
      game.simpleAddTile(neutral, forestSpace, {tileType: TileType.GREENERY});
    }

    placeCityAndForest(game, 1);
    placeCityAndForest(game, -1);
  }
}
