import {ARABIA_TERRA_AWARDS, ARES_AWARDS, Awards, ELYSIUM_AWARDS, HELLAS_AWARDS, MOON_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from './awards/Awards';
import {Banker} from './awards/Banker';
import {Benefactor} from './awards/Benefactor';
import {Celebrity} from './awards/Celebrity';
import {Contractor} from './awards/Contractor';
import {Cultivator} from './awards/Cultivator';
import {DesertSettler} from './awards/DesertSettler';
import {Entrepreneur} from './awards/Entrepreneur';
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
import {BoardName} from './boards/BoardName';
import {GameOptions} from './Game';
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
import {ARABIA_TERRA_MILESTONES, ARES_MILESTONES, ELYSIUM_MILESTONES, HELLAS_MILESTONES, Milestones, MOON_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from './milestones/Milestones';
import {Networker} from './milestones/Networker';
import {Planner} from './milestones/Planner';
import {PolarExplorer} from './milestones/PolarExplorer';
import {RimSettler} from './milestones/RimSettler';
import {Specialist} from './milestones/Specialist';
import {Tactician} from './milestones/Tactician';
import {Terraformer} from './milestones/Terraformer';
import {Tycoon} from './milestones/Tycoon';
import {FullMoon} from './moon/FullMoon';
import {Lunarchitect} from './moon/Lunarchitect';
import {LunarMagnate} from './moon/LunarMagnate';
import {OneGiantStep} from './moon/OneGiantStep';
import {RandomMAOptionType} from './RandomMAOptionType';

export namespace MilestoneAwardSelector {
  // This map uses keys of the format "X|Y" where X and Y are MA names. Entries are stored as "X|Y"
  // and also "Y|X"; it just makes searching slightly faster. There will also be entries of the type "X|X".
  //
  // I honestly don't remember why "X|X" is useful, and it's possible it's no longer necessary. That's
  // something that should be carefully conisdered and possibly removed, and not just propagated because
  // it's what we had to begin with. In other words, someone figure out why, and preserve it, and document
  // why, or be certain it's unnecessary and remove this paragraph and the code below that sets "X|X" to 1000.
  //
  class SynergyMap {
    private readonly map: Map<string, number> = new Map();
    public set(a: string, b: string, weight: number): void {
      this.map.set(a + '|' + b, weight);
      this.map.set(b + '|' + a, weight);
    }

    public get(a: string, b: string) {
      return this.map.get(a + '|' + b) || 0;
    }
  };

  class Synergies {
    public static map: SynergyMap = Synergies.makeMap();

    private constructor() {
    }

    private static makeMap(): SynergyMap {
      const synergies = new SynergyMap();

      // Higher synergies represent similar milestones or awards. For instance, Terraformer rewards for high TR
      // and the Benefactor award is given to the player with the highets TR. Their synergy weight is 9, very high.
      function bind(A: { new(): IMilestone | IAward }, B: { new(): IMilestone | IAward }, weight: number):void;
      function bind(a: string, b: string, weight: number):void;
      function bind(A: any, B: any, weight: number):void {
        if (typeof A === 'string') {
          synergies.set(A, B, weight);
        } else {
          synergies.set(new A().name, new B().name, weight);
        }
      }

      Milestones.ALL.forEach((ma) => {
        bind(ma.name, ma.name, 1000);
      });
      Awards.ALL.forEach((ma) => {
        bind(ma.name, ma.name, 1000);
      });

      bind(Terraformer, Benefactor, 9);
      bind(Gardener, Cultivator, 9);
      bind(Builder, Contractor, 9);
      bind(Networker, Entrepreneur, 9);
      bind(OneGiantStep, FullMoon, 9);
      bind(Lunarchitect, LunarMagnate, 9);
      bind(OneGiantStep, Lunarchitect, 9);
      bind(FullMoon, LunarMagnate, 9);
      bind(EstateDealer, Cultivator, 8);
      bind(Landlord, Cultivator, 8);
      bind(Landlord, DesertSettler, 7);
      bind(Landlord, EstateDealer, 7);
      bind(DesertSettler, Cultivator, 7);
      bind(Miner, Industrialist, 7);
      bind(OneGiantStep, LunarMagnate, 7);
      bind(Lunarchitect, FullMoon, 7);
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
      return synergies;
    }
  }

  function shuffle<T>(arr: Array<T>) {
    arr = arr.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // Function to compute max synergy of a given set of milestones and awards.
  // Exported for testing
  export function maximumSynergy(names: Array<string>) : number {
    let max = 0;
    for (let i = 0; i < names.length - 1; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const synergy = Synergies.map.get(names[i], names[j]);
        max = Math.max(synergy, max);
      }
    }
    return max;
  }

  export interface Constraints {
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

  export const UNLIMITED_SYNERGY: Constraints = {
    maxSynergyAllowed: 100,
    totalSynergyAllowed: 100,
    numberOfHighAllowed: 100,
    highThreshold: 100,
  };

  export function chooseMilestonesAndAwards(gameOptions: GameOptions): IDrawnMilestonesAndAwards {
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
      case BoardName.ARABIA_TERRA:
        drawnMilestonesAndAwards.milestones.push(...ARABIA_TERRA_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...ARABIA_TERRA_AWARDS);
        break;
      }
      if (includeVenus) {
        drawnMilestonesAndAwards.milestones.push(...VENUS_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...VENUS_AWARDS);
      }
      if (gameOptions.aresExtension) {
        drawnMilestonesAndAwards.milestones.push(...ARES_MILESTONES);
        drawnMilestonesAndAwards.awards.push(...ARES_AWARDS);
      };
      if (gameOptions.moonExpansion) {
        // One MA will reward moon tags, the other will reward moon tiles.
        if (Math.random() > 0.5) {
          drawnMilestonesAndAwards.milestones.push(new OneGiantStep());
          drawnMilestonesAndAwards.awards.push(new LunarMagnate());
        } else {
          drawnMilestonesAndAwards.milestones.push(new Lunarchitect());
          drawnMilestonesAndAwards.awards.push(new FullMoon());
        }
      };
      break;

    case RandomMAOptionType.LIMITED:
      drawnMilestonesAndAwards = getRandomMilestonesAndAwards(gameOptions, requiredQty, LIMITED_SYNERGY);
      break;
    case RandomMAOptionType.UNLIMITED:
      drawnMilestonesAndAwards = getRandomMilestonesAndAwards(gameOptions, requiredQty, UNLIMITED_SYNERGY);
      break;
    }

    return drawnMilestonesAndAwards;
  };

  // Selects |numberMARequested| milestones and |numberMARequested| awards from all available awards and milestones (optionally including
  // Venusian.) It does this by following these rules:
  // 1) No pair with synergy above |maxSynergyAllowed|.
  // 2) Total synergy is |totalSynergyAllowed| or below.
  // 3) Limited a number of pair with synergy at |highThreshold| or above to |numberOfHighAllowed| or below.
  function getRandomMilestonesAndAwards(gameOptions: GameOptions,
    numberMARequested: number,
    constraints: Constraints,
    attempt: number = 1): IDrawnMilestonesAndAwards {
    // 5 is a fine number of attempts. A sample of 100,000 runs showed that this algorithm
    // didn't get past 3.
    // https://github.com/bafolts/terraforming-mars/pull/1637#issuecomment-711411034
    const maxAttempts = 5;
    if (attempt > maxAttempts) {
      throw new Error('No limited synergy milestones and awards set was generated after ' + maxAttempts + ' attempts. Please try again.');
    }

    const toName = (e: {name: string}) => e.name;

    const candidateMilestones = [...ORIGINAL_MILESTONES, ...ELYSIUM_MILESTONES, ...HELLAS_MILESTONES].map(toName);
    const candidateAwards = [...ORIGINAL_AWARDS, ...ELYSIUM_AWARDS, ...HELLAS_AWARDS].map(toName);

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

    // TODO(kberg): Find a way to add the Arabia Terra milestones and awards in.
    const shuffledMilestones = shuffle(candidateMilestones);
    const shuffledAwards = shuffle(candidateAwards);

    const accum = new Accumulator(constraints);

    // Keep adding milestones or awards until there are as many as requested
    while (accum.milestones.length + accum.awards.length < numberMARequested * 2) {
      // If there is enough award, add a milestone. And vice versa. If still need both, flip a coin to decide which to add.
      if (accum.awards.length === numberMARequested || (accum.milestones.length !== numberMARequested && Math.round(Math.random()))) {
        const newMilestone = shuffledMilestones.splice(0, 1)[0];
        // If not enough milestone are left to satisfy the constraints, restart the function with a recursive call.
        if (newMilestone === undefined) {
          return getRandomMilestonesAndAwards(gameOptions, numberMARequested, constraints, attempt+1);
        }
        accum.add(newMilestone, true);
      } else {
        const newAward = shuffledAwards.splice(0, 1)[0];
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
        const synergy = Synergies.map.get(mas[i], mas[j]);
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

    private accumulatedHighCount: number = 0;
    private accumulatedTotalSynergy: number = 0;

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
        const synergy = Synergies.map.get(ma, candidate);
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
}
