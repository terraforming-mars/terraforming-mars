import {MilestoneName} from '../../common/ma/MilestoneName';
import {AwardName} from '../../common/ma/AwardName';
import {Awards} from '../awards/Awards';
import {Milestones} from '../milestones/Milestones';

// Higher synergies represent similar milestones or awards. For instance, Terraformer rewards for high TR
// and the Benefactor award is given to the player with the highets TR. Their synergy weight is 9, very high.

const synergiesData: Array<[MilestoneName | AwardName, MilestoneName | AwardName, number]> = [
  ['Terraformer', 'Benefactor', 9],
  ['Gardener', 'Cultivator', 9],
  ['Builder', 'Contractor', 9],
  ['Networker', 'Entrepreneur', 9],
  ['One Giant Step', 'Full Moon', 9],
  ['Lunarchitect', 'Lunar Magnate', 9],
  ['One Giant Step', 'Lunarchitect', 9],
  ['Full Moon', 'Lunar Magnate', 9],
  ['Estate Dealer', 'Cultivator', 8],
  ['Landlord', 'Cultivator', 8],
  ['Landlord', 'Desert Settler', 7],
  ['Landlord', 'Estate Dealer', 7],
  ['Desert Settler', 'Cultivator', 7],
  ['Miner', 'Industrialist', 7],
  ['One Giant Step', 'Lunar Magnate', 7],
  ['Lunarchitect', 'Full Moon', 7],
  ['Energizer', 'Industrialist', 6],
  ['Gardener', 'Landlord', 6],
  ['Mayor', 'Landlord', 6],
  ['Mayor', 'Cultivator', 6],
  ['Gardener', 'Estate Dealer', 5],
  ['Builder', 'Magnate', 5],
  ['Tycoon', 'Magnate', 5],
  ['Polar Explorer', 'Desert Settler', 5],
  ['Hoverlord', 'Excentric', 5],
  ['Hoverlord', 'Venuphile', 5],
  ['Desert Settler', 'Estate Dealer', 5],
  ['Builder', 'Tycoon', 4],
  ['Specialist', 'Energizer', 4],
  ['Mayor', 'Polar Explorer', 4],
  ['Mayor', 'Desert Settler', 4],
  ['Mayor', 'Estate Dealer', 4],
  ['Gardener', 'Polar Explorer', 4],
  ['Gardener', 'Desert Settler', 4],
  ['Ecologist', 'Excentric', 4],
  ['Polar Explorer', 'Landlord', 4],
  ['Mayor', 'Gardener', 3],
  ['Tycoon', 'Excentric', 3],
  ['Polar Explorer', 'Cultivator', 3],
  ['Energizer', 'Thermalist', 3],
  ['Rim Settler', 'Space Baron', 3],
  ['Celebrity', 'Space Baron', 3],
  ['Benefactor', 'Cultivator', 3],
  ['Gardener', 'Benefactor', 2],
  ['Specialist', 'Banker', 2],
  ['Ecologist', 'Tycoon', 2],
  ['Ecologist', 'Diversifier', 2],
  ['Tycoon', 'Scientist', 2],
  ['Tycoon', 'Contractor', 2],
  ['Tycoon', 'Venuphile', 2],
  ['Polar Explorer', 'Estate Dealer', 2],
  ['Rim Settler', 'Celebrity', 2],
  ['Scientist', 'Magnate', 2],
  ['Magnate', 'Space Baron', 2],
  ['Excentric', 'Venuphile', 2],
  ['Terraformer', 'Cultivator', 2],
  ['Terraformer', 'Gardener', 2],
  ['Builder', 'Miner', 1],
  ['Builder', 'Industrialist', 1],
  ['Planner', 'Scientist', 1],
  ['Generalist', 'Miner', 1],
  ['Specialist', 'Thermalist', 1],
  ['Specialist', 'Miner', 1],
  ['Specialist', 'Industrialist', 1],
  ['Ecologist', 'Cultivator', 1],
  ['Ecologist', 'Magnate', 1],
  ['Tycoon', 'Diversifier', 1],
  ['Tycoon', 'Tactician', 1],
  ['Tycoon', 'Rim Settler', 1],
  ['Tycoon', 'Space Baron', 1],
  ['Diversifier', 'Magnate', 1],
  ['Tactician', 'Scientist', 1],
  ['Tactician', 'Magnate', 1],
  ['Rim Settler', 'Magnate', 1],
  ['Banker', 'Benefactor', 1],
  ['Celebrity', 'Magnate', 1],
  ['Desert Settler', 'Benefactor', 1],
  ['Estate Dealer', 'Benefactor', 1],
  ['Terraformer', 'Landlord', 1],
  ['Terraformer', 'Thermalist', 1],
  ['Terraformer', 'Desert Settler', 1],
  ['Terraformer', 'Estate Dealer', 1],
  ['Gardener', 'Ecologist', 1],

  // Vastitas Borealis
  ['Smith', 'Generalist', 2],
  ['Smith', 'Specialist', 5],
  ['Smith', 'Rim Settler', 3],
  ['Smith', 'Miner', 8],
  ['Smith', 'Industrialist', 5],

  ['Tradesman', 'Ecologist', 6],
  ['Tradesman', 'Diversifier', 3],
  ['Tradesman', 'Hoverlord', 6],
  ['Tradesman', 'Excentric', 8],
  ['Tradesman', 'Venuphile', 4],

  ['Irrigator', 'Mayor', 3],
  ['Irrigator', 'Gardener', 3],
  ['Irrigator', 'Polar Explorer', 3],
  ['Irrigator', 'Landlord', 4],
  ['Irrigator', 'Desert Settler', 5],
  ['Irrigator', 'Estate Dealer', 9],
  ['Irrigator', 'Cultivator', 4],

  ['Adapter', 'Ecologist', 2],
  ['Adapter', 'Tactician', 3],
  ['Adapter', 'Scientist', 5],

  ['Edgedancer', 'Mayor', 2],
  ['Edgedancer', 'Gardener', 4],
  ['Edgedancer', 'Polar Explorer', 5],
  ['Edgedancer', 'Desert Settler', 5],
  ['Edgedancer', 'Estate Dealer', 1],
  ['Edgedancer', 'Cultivator', 4],
  ['Edgedancer', 'Irrigator', 1],

  ['Naturalist', 'Terraformer', 3],
  ['Naturalist', 'Gardener', 2],
  ['Naturalist', 'Generalist', 2],
  ['Naturalist', 'Specialist', 1],
  ['Naturalist', 'Landlord', 4],
  ['Naturalist', 'Thermalist', 6],
  ['Naturalist', 'Desert Settler', 1],
  ['Naturalist', 'Estate Dealer', 1],
  ['Naturalist', 'Benefactor', 5],
  ['Naturalist', 'Cultivator', 3],
  ['Naturalist', 'Edgedancer', 1],

  // Start of fan synergies:
  ['Voyager', 'Rim Settler', 9],
  ['Pioneer', 'Colonizer', 9],
];

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
}

export const synergies: SynergyMap = new SynergyMap();

Milestones.ALL.forEach((ma) => {
  synergies.set(ma.name, ma.name, 1000);
});
Awards.ALL.forEach((ma) => {
  synergies.set(ma.name, ma.name, 1000);
});

for (const [a, b, weight] of synergiesData) {
  synergies.set(a, b, weight);
}

