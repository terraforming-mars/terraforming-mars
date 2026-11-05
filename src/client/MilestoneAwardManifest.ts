import {AwardName} from '@/common/ma/AwardName';
import {ClientAward, ClientMilestone} from '@/common/ma/ClientMilestoneAward';
import {MilestoneName} from '@/common/ma/MilestoneName';
import milestonejson from '@/genfiles/milestones.json';
import awardjson from '@/genfiles/awards.json';

const milestones = {} as Record<MilestoneName, ClientMilestone>;
const awards = {} as Record<AwardName, ClientAward>;

milestonejson.forEach((e) => {
  milestones[e.name] = e;
});

awardjson.forEach((e) => {
  awards[e.name] = e;
});

export function getMilestone(name: MilestoneName): ClientMilestone {
  return milestones[name];
}

export function getAward(name: AwardName): ClientAward {
  return awards[name];
}
