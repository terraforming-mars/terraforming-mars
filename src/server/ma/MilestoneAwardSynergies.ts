import {MilestoneName, milestoneNames} from '../../common/ma/MilestoneName';
import {AwardName, awardNames} from '../../common/ma/AwardName';
import {milestoneManifest} from '../milestones/Milestones';
import {BoardName} from '../../common/boards/BoardName';
import {awardManifest} from '../awards/Awards';
import * as rawSynergies from './synergies.json';

// Higher synergies represent similar milestones or awards. For instance, Terraformer rewards for high TR
// and the Benefactor award is given to the player with the highest TR. Their synergy weight is 9, very high.
const synergiesData = rawSynergies as Array<[MilestoneName | AwardName, MilestoneName | AwardName, number]>;

// This map uses keys of the format "X|Y" where X and Y are MA names. Entries are stored as "X|Y"
// and also "Y|X"; it just makes searching slightly faster. There will also be entries of the type "X|X".
//
// I honestly don't remember why "X|X" is useful, and it's possible it's no longer necessary. That's
// something that should be carefully considered and possibly removed, and not just propagated because
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

const VBN = [...milestoneManifest.boards[BoardName.VASTITAS_BOREALIS_NOVUS], ...awardManifest.boards[BoardName.VASTITAS_BOREALIS_NOVUS]];
milestoneNames.forEach((name) => {
  for (const entry of VBN) {
    synergies.set(name, entry, 5);
  }
  synergies.set(name, name, 1000);
});
awardNames.forEach((name) => {
  for (const entry of VBN) {
    synergies.set(name, entry, 5);
  }
  synergies.set(name, name, 1000);
});

for (const [a, b, weight] of synergiesData) {
  synergies.set(a, b, weight);
}
