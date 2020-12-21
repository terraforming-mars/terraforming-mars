import {AresHandler} from './ares/AresHandler';
import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from './awards/Awards';
import {Board} from './boards/Board';
import {BoardName} from './boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {RandomBoardOptionType} from './boards/RandomBoardOptionType';
import {GameOptions} from './Game';
import {HellasBoard} from './boards/HellasBoard';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from './milestones/Milestones';
import {OriginalBoard} from './boards/OriginalBoard';
import {RandomMAOptionType} from './RandomMAOptionType';
import {getRandomMilestonesAndAwards, IDrawnMilestonesAndAwards} from './MilestoneAwardSelector';

export class GameSetup {
  public static chooseMilestonesAndAwards = function(gameOptions: GameOptions): IDrawnMilestonesAndAwards {
    let drawnMilestonesAndAwards = {
      milestones: [],
      awards: [],
    } as IDrawnMilestonesAndAwards;

    const includeVenus = gameOptions.venusNextExtension && gameOptions.includeVenusMA;
    const requiredQty = includeVenus ? 5 : 6;

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
      AresHandler.setupMilestonesAwards(drawnMilestonesAndAwards);
    };
    return drawnMilestonesAndAwards;
  };

  // Function to construct the board and milestones/awards list
  public static newBoard(boardName: BoardName, shuffle: RandomBoardOptionType, seed: number): Board {
    if (boardName === BoardName.ELYSIUM) {
      return new ElysiumBoard(shuffle, seed);
    } else if (boardName === BoardName.HELLAS) {
      return new HellasBoard(shuffle, seed);
    } else {
      return new OriginalBoard(shuffle, seed);
    }
  }
}
