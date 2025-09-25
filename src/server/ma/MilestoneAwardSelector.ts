import {awardManifest} from '../awards/Awards';
import {BoardName} from '../../common/boards/BoardName';
import {GameOptions} from '../game/GameOptions';
import {milestoneManifest} from '../milestones/Milestones';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {inplaceShuffle} from '../utils/shuffle';
import {UnseededRandom} from '../../common/utils/Random';
import {MilestoneName, milestoneNames} from '../../common/ma/MilestoneName';
import {AwardName, awardNames} from '../../common/ma/AwardName';
import {synergies} from './MilestoneAwardSynergies';
import {MAManifest, isCompatible} from './MAManifest';
import {intersection} from '../../common/utils/utils';

type DrawnMilestonesAndAwards = {
  milestones: Array<MilestoneName>,
  awards: Array<AwardName>
}

// Compute max synergy of a given set of milestones and awards. Exported for testing.
export function maximumSynergy(names: ReadonlyArray<MilestoneName | AwardName>) : number {
  let max = 0;
  for (let i = 0; i < names.length - 1; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const synergy = synergies.get(names[i], names[j]);
      max = Math.max(synergy, max);
    }
  }
  return max;
}

type Constraints = {
    // No pairing may have a synergy greater than this.
    maxSynergyAllowed: number;
    // Sum of all the synergies may be no greater than this.
    totalSynergyAllowed: number;
    // 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
    numberOfHighAllowed: number;
    highThreshold: number;
  }

export const LIMITED_SYNERGY: Constraints = {
  maxSynergyAllowed: 6,
  totalSynergyAllowed: 20,
  numberOfHighAllowed: 20,
  highThreshold: 4,
};

const UNLIMITED_SYNERGY: Constraints = {
  maxSynergyAllowed: 100,
  totalSynergyAllowed: 100,
  numberOfHighAllowed: 100,
  highThreshold: 100,
};

export function chooseMilestonesAndAwards(gameOptions: GameOptions): DrawnMilestonesAndAwards {
  let drawnMilestonesAndAwards: DrawnMilestonesAndAwards = {
    milestones: [],
    awards: [],
  };

  function push(milestones: ReadonlyArray<MilestoneName>, awards: ReadonlyArray<AwardName>) {
    drawnMilestonesAndAwards.milestones.push(...milestones);
    drawnMilestonesAndAwards.awards.push(...awards);
  }

  const requiredQty = gameOptions.venusNextExtension ? 6 : 5;

  switch (gameOptions.randomMA) {
  case RandomMAOptionType.NONE:
    const boardName = gameOptions.boardName;
    switch (gameOptions.boardName) {
    case BoardName.THARSIS:
    case BoardName.HELLAS:
    case BoardName.ELYSIUM:
    case BoardName.ARABIA_TERRA:
    case BoardName.AMAZONIS:
    case BoardName.TERRA_CIMMERIA:
    case BoardName.VASTITAS_BOREALIS:
    case BoardName.VASTITAS_BOREALIS_NOVUS:
      push(milestoneManifest.boards[boardName], awardManifest.boards[gameOptions.boardName]);
      break;
    case BoardName.UTOPIA_PLANITIA:
      return getRandomMilestonesAndAwards(gameOptions, requiredQty, LIMITED_SYNERGY);
    case BoardName.TERRA_CIMMERIA_NOVUS:
      return getRandomMilestonesAndAwards(gameOptions, requiredQty, LIMITED_SYNERGY);
    }
    if (gameOptions.venusNextExtension) {
      push(milestoneManifest.expansions['venus'], awardManifest.expansions['venus']);
    }
    if (gameOptions.aresExtension) {
      push(milestoneManifest.expansions['ares'], awardManifest.expansions['ares']);
    }
    if (gameOptions.moonExpansion) {
      // One MA will reward moon tags, the other will reward moon tiles.
      if (Math.random() > 0.5) {
        push(['One Giant Step'], ['Lunar Magnate']);
      } else {
        push(['Lunarchitect'], ['Full Moon']);
      }
    }
    break;

  case RandomMAOptionType.LIMITED:
    drawnMilestonesAndAwards = getRandomMilestonesAndAwards(gameOptions, requiredQty, LIMITED_SYNERGY);
    break;
  case RandomMAOptionType.UNLIMITED:
    drawnMilestonesAndAwards = getRandomMilestonesAndAwards(gameOptions, requiredQty, UNLIMITED_SYNERGY);
    break;
  default:
    throw new Error('Unknown milestone/award type: ' + gameOptions.randomMA);
  }

  return drawnMilestonesAndAwards;
}

/**
 * Return the list of possible milestones and awards for a given game. Only meant to work with random selection.
 *
 * Isn't meant to work with RandomMAOptionType.NONE
 *
 * exported for tests
 */
export function getCandidates(gameOptions: GameOptions): [Array<MilestoneName>, Array<AwardName>] {
  function include<T extends string>(name: T, manifest: MAManifest<T, any>): boolean {
    // When using modular, don't include non-modular MAs.
    if (gameOptions.modularMA) {
      throw new Error('Not supporting modular awards yet.');
    }

    if (!gameOptions.modularMA) {
      // The game boards this MA appears in, if any.
      const boards = Object.values(BoardName).filter((boardName) => manifest.boards[boardName].includes(name));

      // Always include the milestones and awards from the official boards
      if (intersection(boards, [BoardName.THARSIS, BoardName.ELYSIUM, BoardName.HELLAS]).length > 0) {
        return true;
      }
      // Conditionally include milestones and awards from unofficial boards.
      if (boards.length > 0 && gameOptions.includeFanMA === false) {
        return false;
      }

      // Disable the new modular awards until they're weighted.
      if (manifest.modular.includes(name)) {
        return false;
      }
    }

    if (!isCompatible(name, manifest, gameOptions)) {
      return false;
    }

    return true;
  }

  const candidateMilestones = milestoneNames.filter((name) => include(name, milestoneManifest));
  const candidateAwards = awardNames.filter((name) => include(name, awardManifest));

  return [candidateMilestones, candidateAwards];
}

// Selects |numberMARequested| milestones and |numberMARequested| awards from all available awards and milestones (optionally including
// Venusian.) It does this by following these rules:
// 1) No pair with synergy above |maxSynergyAllowed|.
// 2) Total synergy is |totalSynergyAllowed| or below.
// 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
function getRandomMilestonesAndAwards(gameOptions: GameOptions,
  numberMARequested: number,
  constraints: Constraints,
  attempt: number = 1): DrawnMilestonesAndAwards {
  // 5 is a fine number of attempts. A sample of 100,000 runs showed that this algorithm
  // didn't get past 3.
  // https://github.com/terraforming-mars/terraforming-mars/pull/1637#issuecomment-711411034
  const maxAttempts = 5;
  if (attempt > maxAttempts) {
    throw new Error('No limited synergy milestones and awards set was generated after ' + maxAttempts + ' attempts. Please try again.');
  }

  const [candidateMilestones, candidateAwards] = getCandidates(gameOptions);

  inplaceShuffle(candidateMilestones, UnseededRandom.INSTANCE);
  inplaceShuffle(candidateAwards, UnseededRandom.INSTANCE);

  const accum = new Accumulator(constraints);

  // Keep adding milestones or awards until there are as many as requested
  while (accum.milestones.length + accum.awards.length < numberMARequested * 2) {
    // If there is enough award, add a milestone. And vice versa. If still need both, flip a coin to decide which to add.
    if (accum.awards.length === numberMARequested || (accum.milestones.length !== numberMARequested && Math.round(Math.random()))) {
      const newMilestone = candidateMilestones.splice(0, 1)[0];
      // If not enough milestone are left to satisfy the constraints, restart the function with a recursive call.
      if (newMilestone === undefined) {
        return getRandomMilestonesAndAwards(gameOptions, numberMARequested, constraints, attempt+1);
      }
      accum.add(newMilestone, true);
    } else {
      const newAward = candidateAwards.splice(0, 1)[0];
      // If not enough awards are left to satisfy the constraints, restart the function with a recursive call.
      if (newAward === undefined) {
        return getRandomMilestonesAndAwards(gameOptions, numberMARequested, constraints, attempt+1);
      }
      accum.add(newAward, false);
    }
  }

  if (!verifySynergyRules(accum.milestones, accum.awards, constraints)) {
    throw new Error('The randomized milestones and awards set does not satisfy the given synergy rules.');
  }

  return {
    milestones: accum.milestones,
    awards: accum.awards,
  };
}

// Verify whether a given array of |milestoneAwardArray| satisfies the following these rules:
// 1) No pair with synergy above |maxSynergyAllowed|.
// 2) Total synergy is |totalSynergyAllowed| or below.
// 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
export function verifySynergyRules(
  milestones: ReadonlyArray<MilestoneName>,
  awards: ReadonlyArray<AwardName>,
  constraints: Constraints): boolean {
  let max = 0;
  let totalSynergy = 0;
  let numberOfHigh = 0;
  const mas: Array<string> = [...milestones];
  mas.push(...awards);
  for (let i = 0; i < mas.length - 1; i++) {
    for (let j = i + 1; j < mas.length; j++) {
      const synergy = synergies.get(mas[i], mas[j]);
      max = Math.max(synergy, max);
      totalSynergy += synergy;
      if (synergy >= constraints.highThreshold) numberOfHigh++;
    }
  }
  return max <= constraints.maxSynergyAllowed &&
      totalSynergy <= constraints.totalSynergyAllowed &&
      numberOfHigh <= constraints.numberOfHighAllowed;
}

class Accumulator {
  milestones: Array<MilestoneName> = [];
  awards: Array<AwardName> = [];

  private accumulatedHighCount = 0;
  private accumulatedTotalSynergy = 0;

  constructor(private constraints: Constraints) {
  }

  // Conditionally add a milestone or award when it doesn't
  // violate synergy constraints.
  //
  // |ma| is the milestone or award, |milestone| is true when
  // |ma| represents a milestone and false when it represents
  // an award.
  //
  // Returns true when successful, false otherwise.
  //
  add(candidate: MilestoneName | AwardName, milestone: boolean): boolean {
    let totalSynergy = this.accumulatedTotalSynergy;
    let highCount = this.accumulatedHighCount;
    let max = 0;

    // Find the maximum synergy of this new item compared to the others
    (this.milestones as Array<string>).concat(this.awards).forEach((ma) => {
      const synergy = synergies.get(ma, candidate);
      totalSynergy += synergy;
      if (synergy >= this.constraints.highThreshold) {
        highCount++;
      }
      max = Math.max(synergy, max);
    });
    // Check whether the addition violates any rule.
    if (max <= this.constraints.maxSynergyAllowed &&
        highCount <= this.constraints.numberOfHighAllowed &&
        totalSynergy <= this.constraints.totalSynergyAllowed) {
      if (milestone) {
        this.milestones.push(candidate as MilestoneName);
      } else {
        this.awards.push(candidate as AwardName);
      }
      // Update the stats
      this.accumulatedHighCount = highCount;
      this.accumulatedTotalSynergy = totalSynergy;
      return true;
    } else {
      return false;
    }
  }
}
