import {AwardName} from '@/common/ma/AwardName';
import {ClientAward, ClientMilestone} from '@/common/ma/ClientMilestoneAward';
import {MilestoneName} from '@/common/ma/MilestoneName';
// @ts-ignore
import * as milestonejson from '@/genfiles/milestones.json';
// @ts-ignore
import * as awardjson from '@/genfiles/awards.json';

const milestones = {} as Record<MilestoneName, ClientMilestone>;
const awards = {} as Record<AwardName, ClientAward>;

(milestonejson as any as Array<ClientMilestone>).forEach((e) => {
  milestones[e.name] = e;
});

(awardjson as any as Array<ClientAward>).forEach((e) => {
  awards[e.name] = e;
});

export function getMilestone(name: MilestoneName): ClientMilestone {
  return milestones[name];
}

export function getAward(name: AwardName): ClientAward {
  return awards[name];
}
