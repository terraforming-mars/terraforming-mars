import {AwardName} from '@/common/ma/AwardName';
import {AwardMetadata, MilestoneMetadata} from '@/common/ma/MilestoneAwardMetadata';
import {MilestoneName} from '@/common/ma/MilestoneName';
// @ts-ignore
import * as milestonejson from '@/genfiles/milestones.json';
import * as awardjson from '@/genfiles/awards.json';

const milestoneDescriptions: Map<MilestoneName, string> = new Map();
const awardDescriptions: Map<AwardName, string> = new Map();

(milestonejson as any as Array<MilestoneMetadata>).forEach((metadata) => {
  milestoneDescriptions.set(metadata.name, metadata.description);
});

(awardjson as any as Array<AwardMetadata>).forEach((metadata) => {
  awardDescriptions.set(metadata.name, metadata.description);
});

export function allMilestoneNames() {
  return milestoneDescriptions.keys();
}

export function allAwardNames() {
  return awardDescriptions.keys();
}

export function getMilestoneDescription(name: MilestoneName): string {
  const description = milestoneDescriptions.get(name);
  if (description === undefined) {
    throw new Error(`Unknown milestone or award ${name}`);
  }
  return description;
}

export function getAwardDescription(name: AwardName): string {
  const description = awardDescriptions.get(name);
  if (description === undefined) {
    throw new Error(`Unknown milestone or award ${name}`);
  }
  return description;
}
