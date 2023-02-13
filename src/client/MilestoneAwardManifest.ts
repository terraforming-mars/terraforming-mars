import {AwardName} from '@/common/ma/AwardName';
import {MilestoneAwardMetadata} from '@/common/ma/MilestoneAwardMetadata';
import {MilestoneName} from '@/common/ma/MilestoneName';
// @ts-ignore
import * as maJson from '@/genfiles/ma.json';

const descriptions: Map<AwardName | MilestoneName, string> = new Map();
(maJson as any as Array<MilestoneAwardMetadata>).forEach((metadata) => {
  descriptions.set(metadata.name, metadata.description);
});

export function allMaNames() {
  return descriptions.keys();
}

export function getMilestoneAwardDescription(name: AwardName | MilestoneName): string {
  const description = descriptions.get(name);
  if (description === undefined) {
    throw new Error(`Unknown milestone or award ${name}`);
  }
  return description;
}
