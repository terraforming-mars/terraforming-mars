import {
  AMAZONIS_PLANITIA_AWARDS,
  ARABIA_TERRA_AWARDS,
  ARES_AWARDS,
  Awards,
  ELYSIUM_AWARDS,
  HELLAS_AWARDS,
  MOON_AWARDS,
  THARSIS_AWARDS,
  TERRA_CIMMERIA_AWARDS,
  VASTITAS_BOREALIS_AWARDS,
  VENUS_AWARDS,
  UNDERWORLD_AWARDS,
} from '../awards/Awards';
import {IAward} from '../awards/IAward';
import {BoardName} from '../../common/boards/BoardName';
import {GameOptions} from '../game/GameOptions';
import {IMilestone} from '../milestones/IMilestone';
import {
  AMAZONIS_PLANITIA_MILESTONES,
  ARABIA_TERRA_MILESTONES,
  ARES_MILESTONES,
  ELYSIUM_MILESTONES,
  HELLAS_MILESTONES,
  Milestones,
  MOON_MILESTONES,
  THARSIS_MILESTONES,
  TERRA_CIMMERIA_MILESTONES,
  VASTITAS_BOREALIS_MILESTONES,
  VENUS_MILESTONES,
  UNDERWORLD_MILESTONES,
} from '../milestones/Milestones';
import {FullMoon} from '../moon/FullMoon';
import {Lunarchitect} from '../moon/Lunarchitect';
import {LunarMagnate} from '../moon/LunarMagnate';
import {OneGiantStep} from '../moon/OneGiantStep';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {inplaceShuffle} from '../utils/shuffle';
import {UnseededRandom} from '../../common/utils/Random';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {AwardName} from '../../common/ma/AwardName';
import {inplaceRemove} from '../../common/utils/utils';
import {synergies} from './MilestoneAwardSynergies';

type DrawnMilestonesAndAwards = {
  milestones: Array<IMilestone>,
  awards: Array<IAward>
}


// Function to compute max synergy of a given set of milestones and awards.
// Exported for testing
export function maximumSynergy(names: Array<string>) : number {
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

  function push(milestones: Array<IMilestone>, awards: Array<IAward>) {
    drawnMilestonesAndAwards.milestones.push(...milestones);
    drawnMilestonesAndAwards.awards.push(...awards);
  }

  const includeVenus = gameOptions.venusNextExtension && gameOptions.includeVenusMA;
  const requiredQty = includeVenus ? 6 : 5;

  switch (gameOptions.randomMA) {
  case RandomMAOptionType.NONE:
    switch (gameOptions.boardName) {
    case BoardName.THARSIS:
      push(THARSIS_MILESTONES, THARSIS_AWARDS);
      break;
    case BoardName.HELLAS:
      push(HELLAS_MILESTONES, HELLAS_AWARDS);
      break;
    case BoardName.ELYSIUM:
      push(ELYSIUM_MILESTONES, ELYSIUM_AWARDS);
      break;
    case BoardName.ARABIA_TERRA:
      push(ARABIA_TERRA_MILESTONES, ARABIA_TERRA_AWARDS);
      break;
    case BoardName.AMAZONIS:
      push(AMAZONIS_PLANITIA_MILESTONES, AMAZONIS_PLANITIA_AWARDS);
      break;
    case BoardName.TERRA_CIMMERIA:
      push(TERRA_CIMMERIA_MILESTONES, TERRA_CIMMERIA_AWARDS);
      break;
    case BoardName.VASTITAS_BOREALIS:
      push(VASTITAS_BOREALIS_MILESTONES, VASTITAS_BOREALIS_AWARDS);
      break;
    }
    if (includeVenus) {
      push(VENUS_MILESTONES, VENUS_AWARDS);
    }
    if (gameOptions.aresExtension) {
      push(ARES_MILESTONES, ARES_AWARDS);
    }
    if (gameOptions.moonExpansion) {
      // One MA will reward moon tags, the other will reward moon tiles.
      if (Math.random() > 0.5) {
        push([new OneGiantStep], [new LunarMagnate()]);
      } else {
        push([new Lunarchitect], [new FullMoon()]);
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

  function toName<T>(e: {name: T}): T {
    return e.name;
  }

  const candidateMilestones: Array<MilestoneName> = [...THARSIS_MILESTONES, ...ELYSIUM_MILESTONES, ...HELLAS_MILESTONES].map(toName);
  const candidateAwards: Array<AwardName> = [...THARSIS_AWARDS, ...ELYSIUM_AWARDS, ...HELLAS_AWARDS].map(toName);

  if (gameOptions.venusNextExtension && gameOptions.includeVenusMA) {
    candidateMilestones.push(...VENUS_MILESTONES.map(toName));
    candidateAwards.push(...VENUS_AWARDS.map(toName));
  }
  if (gameOptions.aresExtension) {
    candidateMilestones.push(...ARES_MILESTONES.map(toName));
    candidateAwards.push(...ARES_AWARDS.map(toName));
  }
  if (gameOptions.moonExpansion) {
    candidateMilestones.push(...MOON_MILESTONES.map(toName));
    candidateAwards.push(...MOON_AWARDS.map(toName));
  }

  if (gameOptions.underworldExpansion) {
    candidateMilestones.push(...UNDERWORLD_MILESTONES.map(toName));
    candidateAwards.push(...UNDERWORLD_AWARDS.map(toName));
  }

  if (gameOptions.includeFanMA) {
    candidateMilestones.push(
      ...ARABIA_TERRA_MILESTONES.map(toName),
      ...AMAZONIS_PLANITIA_MILESTONES.map(toName),
      ...TERRA_CIMMERIA_MILESTONES.map(toName),
      ...VASTITAS_BOREALIS_MILESTONES.map(toName));

    candidateAwards.push(
      ...ARABIA_TERRA_AWARDS.map(toName),
      ...AMAZONIS_PLANITIA_AWARDS.map(toName),
      ...TERRA_CIMMERIA_AWARDS.map(toName),
      ...VASTITAS_BOREALIS_AWARDS.map(toName));

    if (!gameOptions.pathfindersExpansion) {
      inplaceRemove(candidateMilestones, 'Martian');
    }
    if (!gameOptions.coloniesExtension) {
      inplaceRemove(candidateMilestones, 'Colonizer');
      inplaceRemove(candidateMilestones, 'Pioneer');
    }
    if (!gameOptions.turmoilExtension) {
      inplaceRemove(candidateAwards, 'Politician');
    }
    // Special-case Terran and Businessperson, which are exactly the same.
    if (candidateMilestones.includes('Terran') && candidateMilestones.includes('Businessperson')) {
      inplaceRemove(candidateMilestones, 'Terran');
    }
  }

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

  if (!verifySynergyRules(accum.milestones.concat(accum.awards), constraints)) {
    throw new Error('The randomized milestones and awards set does not satisfy the given synergy rules.');
  }

  return {
    milestones: accum.milestones.map((name) => Milestones.getByName(name)),
    awards: accum.awards.map((name) => Awards.getByName(name)),
  };
}

// Verify whether a given array of |milestoneAwardArray| satisfies the following these rules:
// 1) No pair with synergy above |maxSynergyAllowed|.
// 2) Total synergy is |totalSynergyAllowed| or below.
// 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
export function verifySynergyRules(
  mas: Array<string>,
  constraints: Constraints): boolean {
  let max = 0;
  let totalSynergy = 0;
  let numberOfHigh = 0;
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
  milestones: Array<string> = [];
  awards: Array<string> = [];

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
  add(candidate: string, milestone: boolean): boolean {
    let totalSynergy = this.accumulatedTotalSynergy;
    let highCount = this.accumulatedHighCount;
    let max = 0;

    // Find the maximum synergy of this new item compared to the others
    this.milestones.concat(this.awards).forEach((ma) => {
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
        this.milestones.push(candidate);
      } else {
        this.awards.push(candidate);
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
