import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from './awards/Awards';
import {Board} from './boards/Board';
import {BoardName} from './boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {GameOptions} from './Game';
import {HellasBoard} from './boards/HellasBoard';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from './milestones/Milestones';
import {OriginalBoard} from './boards/OriginalBoard';
import {RandomMAOptionType} from './RandomMAOptionType';
import {getRandomMilestonesAndAwards, IDrawnMilestonesAndAwards} from './MilestoneAwardSelector';
import {Player} from './Player';
import {Resources} from './Resources';
import {ColonyName} from './colonies/ColonyName';
import {AresSetup} from './ares/AresSetup';

export class GameSetup {
  public static chooseMilestonesAndAwards = function(gameOptions: GameOptions): IDrawnMilestonesAndAwards {
    let drawnMilestonesAndAwards = {
      milestones: [],
      awards: [],
    } as IDrawnMilestonesAndAwards;

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
  public static newBoard(boardName: BoardName, shuffle: boolean, seed: number, includeVenus: boolean): Board {
    if (boardName === BoardName.ELYSIUM) {
      return ElysiumBoard.newInstance(shuffle, seed, includeVenus);
    } else if (boardName === BoardName.HELLAS) {
      return HellasBoard.newInstance(shuffle, seed, includeVenus);
    } else {
      return OriginalBoard.newInstance(shuffle, seed, includeVenus);
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
}
