import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from './awards/Awards';
import {Banker} from './awards/Banker';
import {Benefactor} from './awards/Benefactor';
import {Celebrity} from './awards/Celebrity';
import {Contractor} from './awards/Contractor';
import {Cultivator} from './awards/Cultivator';
import {DesertSettler} from './awards/DesertSettler';
import {EstateDealer} from './awards/EstateDealer';
import {Excentric} from './awards/Excentric';
import {IAward} from './awards/IAward';
import {Industrialist} from './awards/Industrialist';
import {Landlord} from './awards/Landlord';
import {Magnate} from './awards/Magnate';
import {Miner} from './awards/Miner';
import {Scientist} from './awards/Scientist';
import {SpaceBaron} from './awards/SpaceBaron';
import {Thermalist} from './awards/Thermalist';
import {Venuphile} from './awards/Venuphile';
import {IDrawnMilestonesAndAwards} from './IDrawnMilestonesAndAwards';
import {Builder} from './milestones/Builder';
import {Diversifier} from './milestones/Diversifier';
import {Ecologist} from './milestones/Ecologist';
import {Energizer} from './milestones/Energizer';
import {Gardener} from './milestones/Gardener';
import {Generalist} from './milestones/Generalist';
import {Hoverlord} from './milestones/Hoverlord';
import {IMilestone} from './milestones/IMilestone';
import {Mayor} from './milestones/Mayor';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from './milestones/Milestones';
import {Planner} from './milestones/Planner';
import {PolarExplorer} from './milestones/PolarExplorer';
import {RimSettler} from './milestones/RimSettler';
import {Specialist} from './milestones/Specialist';
import {Tactician} from './milestones/Tactician';
import {Terraformer} from './milestones/Terraformer';
import {Tycoon} from './milestones/Tycoon';

// exported for testing.
export const MA_ITEMS = [
  ...ORIGINAL_MILESTONES,
  ...ELYSIUM_MILESTONES,
  ...HELLAS_MILESTONES,
  ...VENUS_MILESTONES,

  ...ORIGINAL_AWARDS,
  ...ELYSIUM_AWARDS,
  ...HELLAS_AWARDS,
  ...VENUS_AWARDS,
];

export function buildSynergies(): Array<Array<number>> {
  const array: Array<Array<number>> = new Array(MA_ITEMS.length);
  for (let idx = 0; idx < MA_ITEMS.length; idx++) {
    array[idx] = new Array(MA_ITEMS.length).fill(0);
    array[idx][idx] = 1000;
  }

  // Higher synergies represent similar milestones or awards. For instance, Terraformer rewards for high TR
  // and the Benefactor award is given to the player with the highets TR. Their synergy weight is 9, very high.
  function bind(First: { new(): IMilestone | IAward }, Second: { new(): IMilestone | IAward }, weight: number) {
    const row = MA_ITEMS.findIndex((ma) => new First().name === ma.name);
    const col = MA_ITEMS.findIndex((ma) => new Second().name === ma.name);
    array[row][col] = weight;
    array[col][row] = weight;
  }
  bind(Terraformer, Benefactor, 9);
  bind(Gardener, Cultivator, 9);
  bind(Builder, Contractor, 9);
  bind(EstateDealer, Cultivator, 8);
  bind(Landlord, Cultivator, 8);
  bind(Landlord, DesertSettler, 7);
  bind(Landlord, EstateDealer, 7);
  bind(DesertSettler, Cultivator, 7);
  bind(Miner, Industrialist, 7);
  bind(Energizer, Industrialist, 6);
  bind(Gardener, Landlord, 6);
  bind(Mayor, Landlord, 6);
  bind(Mayor, Cultivator, 6);
  bind(Gardener, EstateDealer, 5);
  bind(Builder, Magnate, 5);
  bind(Tycoon, Magnate, 5);
  bind(PolarExplorer, DesertSettler, 5);
  bind(Hoverlord, Excentric, 5);
  bind(Hoverlord, Venuphile, 5);
  bind(DesertSettler, EstateDealer, 5);
  bind(Builder, Tycoon, 4);
  bind(Specialist, Energizer, 4);
  bind(Mayor, PolarExplorer, 4);
  bind(Mayor, DesertSettler, 4);
  bind(Mayor, EstateDealer, 4);
  bind(Gardener, PolarExplorer, 4);
  bind(Gardener, DesertSettler, 4);
  bind(Ecologist, Excentric, 4);
  bind(PolarExplorer, Landlord, 4);
  bind(Mayor, Gardener, 3);
  bind(Tycoon, Excentric, 3);
  bind(PolarExplorer, Cultivator, 3);
  bind(Energizer, Thermalist, 3);
  bind(RimSettler, SpaceBaron, 3);
  bind(Celebrity, SpaceBaron, 3);
  bind(Benefactor, Cultivator, 3);
  bind(Gardener, Benefactor, 2);
  bind(Specialist, Banker, 2);
  bind(Ecologist, Tycoon, 2);
  bind(Ecologist, Diversifier, 2);
  bind(Tycoon, Scientist, 2);
  bind(Tycoon, Contractor, 2);
  bind(Tycoon, Venuphile, 2);
  bind(PolarExplorer, EstateDealer, 2);
  bind(RimSettler, Celebrity, 2);
  bind(Scientist, Magnate, 2);
  bind(Magnate, SpaceBaron, 2);
  bind(Excentric, Venuphile, 2);
  bind(Terraformer, Cultivator, 2);
  bind(Terraformer, Gardener, 2);
  bind(Builder, Miner, 1);
  bind(Builder, Industrialist, 1);
  bind(Planner, Scientist, 1);
  bind(Generalist, Miner, 1);
  bind(Specialist, Thermalist, 1);
  bind(Specialist, Miner, 1);
  bind(Specialist, Industrialist, 1);
  bind(Ecologist, Cultivator, 1);
  bind(Ecologist, Magnate, 1);
  bind(Tycoon, Diversifier, 1);
  bind(Tycoon, Tactician, 1);
  bind(Tycoon, RimSettler, 1);
  bind(Tycoon, SpaceBaron, 1);
  bind(Diversifier, Magnate, 1);
  bind(Tactician, Scientist, 1);
  bind(Tactician, Magnate, 1);
  bind(RimSettler, Magnate, 1);
  bind(Banker, Benefactor, 1);
  bind(Celebrity, Magnate, 1);
  bind(DesertSettler, Benefactor, 1);
  bind(EstateDealer, Benefactor, 1);
  bind(Terraformer, Landlord, 1);
  bind(Terraformer, Thermalist, 1);
  bind(Terraformer, DesertSettler, 1);
  bind(Terraformer, EstateDealer, 1);
  bind(Gardener, Ecologist, 1);
  return array;
}

const SYNERGIES = buildSynergies();

function shuffleArray(arr: Array<number>) {
  arr = arr.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Returns an array from [start... end]
// eg (4, 11) returns [4, 5, 6, 7, 8, 9, 10, 11]
function getNumbersRange(start: number, end: number): Array<number> {
  return Array.from(Array(end + 1 - start).keys()).map((n) => n + start);
}

// Function to compute max synergy of a given set of milestones and awards.
export function computeSynergy(indexes: Array<number>) : number {
  let max = 0;
  for (let i = 0; i<indexes.length - 1; i++) {
    for (let j = i + 1; j<indexes.length; j++) {
      const synergy = SYNERGIES[indexes[i]][indexes[j]];
      max = Math.max(synergy, max);
    }
  }
  return max;
}

// Limited Synergy Constants
const MAX_RANDOM_ATTEMPTS: number = 5;
export const MAX_SYNERGY_ALLOWED_RULE: number= 6;
export const TOTAL_SYNERGY_ALLOWED_RULE: number= 20;
export const NUM_HIGH_ALLOWED_RULE: number= 20;
export const HIGH_THRESHOLD_RULE: number= 4;

// Selects |numberMARequested| milestones and |numberMARequested| awards from all available awards and milestones (optionally including
// Venusian.) It does this by following these rules:
// 1) No pair with synergy above |maxSynergyAllowed|.
// 2) Total synergy is |totalSynergyAllowed| or below.
// 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
export function getRandomMilestonesAndAwards(withVenusian: boolean = true,
  numberMARequested: number,
  maxSynergyAllowed: number = MAX_SYNERGY_ALLOWED_RULE,
  totalSynergyAllowed: number = TOTAL_SYNERGY_ALLOWED_RULE,
  numberOfHighAllowed: number = NUM_HIGH_ALLOWED_RULE,
  highThreshold: number = HIGH_THRESHOLD_RULE,
  attempt: number = 1): IDrawnMilestonesAndAwards {
  if (attempt > MAX_RANDOM_ATTEMPTS) {
    throw new Error('No limited synergy milestones and awards set was generated after ' + MAX_RANDOM_ATTEMPTS + ' attempts. Please try again.');
  }

  // Shuffled arrays on milestones and awards once
  const shuffled_milestones = shuffleArray(getNumbersRange(0, withVenusian ? 15: 14));
  const shuffled_awards = shuffleArray(getNumbersRange(16, withVenusian ? 31: 30));

  const pickedMA = new MASynergyArray(maxSynergyAllowed, totalSynergyAllowed, numberOfHighAllowed, highThreshold);
  let milestoneCount = 0;
  let awardCount = 0;

  // Keep adding milestone or award until there are enough as requested
  while (milestoneCount + awardCount < numberMARequested*2) {
    // If there is enough award, add a milestone. And vice versa. If still need both, flip a coin to decide which to add.
    if (awardCount === numberMARequested || (milestoneCount !== numberMARequested && Math.round(Math.random()))) {
      const newMilestone = shuffled_milestones.splice(0, 1)[0];
      // If need to add more milestone, but not enough milestone left, restart the function with a recursive call.
      if (newMilestone === undefined) {
        return getRandomMilestonesAndAwards(withVenusian, numberMARequested, maxSynergyAllowed, totalSynergyAllowed, numberOfHighAllowed, highThreshold, attempt+1);
      }
      const milestoneAddSuccess = pickedMA.addNewMA(newMilestone);
      if (milestoneAddSuccess) milestoneCount++;
    } else {
      const newAward = shuffled_awards.splice(0, 1)[0];
      // If need to add more award, but not enough award left, restart the function with a recursive call.
      if (newAward === undefined) {
        return getRandomMilestonesAndAwards(withVenusian, numberMARequested, maxSynergyAllowed, totalSynergyAllowed, numberOfHighAllowed, highThreshold, attempt+1);
      }
      const awardAddSuccess = pickedMA.addNewMA(newAward);
      if (awardAddSuccess) awardCount++;
    }
  }

  if (!verifySynergyRules(pickedMA.currentMA, maxSynergyAllowed, totalSynergyAllowed, numberOfHighAllowed, highThreshold)) {
    throw new Error('The randomized milestones and awards set does not satisfy the given synergy rules.');
  }

  const finalItems = pickedMA.currentMA.map((n) => MA_ITEMS[n]);
  return {
    milestones: finalItems.slice(0, numberMARequested) as Array<IMilestone>,
    awards: finalItems.slice(numberMARequested) as Array<IAward>,
  };
}

// Verify whether a given array of |milestoneAwardArray| satisfies the following these rules:
// 1) No pair with synergy above |maxSynergyAllowed|.
// 2) Total synergy is |totalSynergyAllowed| or below.
// 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
export function verifySynergyRules(
  milestoneAwardArray: Array<number>,
  maxSynergyAllowed: number = MAX_SYNERGY_ALLOWED_RULE,
  totalSynergyAllowed: number = TOTAL_SYNERGY_ALLOWED_RULE,
  numberOfHighAllowed: number = NUM_HIGH_ALLOWED_RULE,
  highThreshold: number = HIGH_THRESHOLD_RULE): Boolean {
  let max = 0;
  let totalSynergy = 0;
  let numberOfHigh = 0;
  for (let i = 0; i < milestoneAwardArray.length - 1; i++) {
    for (let j = i + 1; j < milestoneAwardArray.length; j++) {
      const synergy = SYNERGIES[milestoneAwardArray[i]][milestoneAwardArray[j]];
      max = Math.max(synergy, max);
      totalSynergy += synergy;
      if (synergy >= highThreshold) numberOfHigh++;
    }
  }
  return (max <= maxSynergyAllowed && totalSynergy <= totalSynergyAllowed && numberOfHigh <= numberOfHighAllowed);
}

class MASynergyArray {
    currentMA: Array<number>;
    maxSynergyAllowed: number;
    totalSynergyAllowed: number;
    numberOfHighAllowed: number;
    highThreshold: number;

    currentNumberOfHigh: number;
    currentTotalSynergy: number;

    constructor(maxSynergyAllowed: number, totalSynergyAllowed: number, numberOfHighAllowed: number, highThreshold:number) {
      this.currentMA = [];
      this.maxSynergyAllowed = maxSynergyAllowed;
      this.totalSynergyAllowed = totalSynergyAllowed;
      this.numberOfHighAllowed = numberOfHighAllowed;
      this.highThreshold = highThreshold;
      this.currentNumberOfHigh = 0;
      this.currentTotalSynergy = 0;
    }

    // A class function for adding a new milestone or award index
    // Return true if adding successfully without violating any rule.
    addNewMA(newMAIndex: number): boolean {
      let tempTotalSynergy = this.currentTotalSynergy;
      let tempNumberOfHigh = this.currentNumberOfHigh;
      let max = 0;

      // Find synergy of this new item with all previous ones
      for (const indexPicked of this.currentMA) {
        const synergy = SYNERGIES[indexPicked][newMAIndex];
        tempTotalSynergy += synergy;
        if (synergy >= this.highThreshold) {
          tempNumberOfHigh++;
        }
        max = Math.max(synergy, max);
      }
      // Check whether the addition violate any rule.
      if (max <= this.maxSynergyAllowed && tempNumberOfHigh <= this.numberOfHighAllowed && tempTotalSynergy <= this.totalSynergyAllowed) {
        // If it is an award, push to the end of the array.
        if (newMAIndex > 15) {
          this.currentMA.push(newMAIndex);
        } else {
          // If it is a milestone, add to the front of the array
          this.currentMA.unshift(newMAIndex);
        }
        // Update the stats
        this.currentNumberOfHigh = tempNumberOfHigh;
        this.currentTotalSynergy = tempTotalSynergy;
        return true;
      } else {
        return false;
      }
    }
}
