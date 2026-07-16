require('dotenv').config();

import {synergies} from '../ma/MilestoneAwardSynergies';
import {MilestoneName, milestoneNames} from '../../common/ma/MilestoneName';
import {AwardName, awardNames} from '../../common/ma/AwardName';
import {milestoneManifest} from '../milestones/Milestones';
import {awardManifest} from '../awards/Awards';

function get(name: MilestoneName | AwardName) {
  try {
    return awardManifest.createOrThrow(name);
  } catch (err) {
    return milestoneManifest.createOrThrow(name);
  }
}
const manames = [...milestoneNames, ...awardNames];
for (const name of manames) {
  const first = get(name);
  console.log(`${first.name} (${first.description}):`);
  const entries = [];
  for (const name2 of manames) {
    const second = get(name2);
    const x = synergies.get(name, name2);
    if (x === 1000 || x === 0) continue;
    entries.push(` ${x} ${second.name} (${second.description})`);
  }
  entries.sort().reverse();
  entries.forEach((x) => console.log(x));
  console.log();
}
