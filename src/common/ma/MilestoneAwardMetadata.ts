import {MilestoneName} from './MilestoneName';
import {AwardName} from './AwardName';

export type MilestoneAwardMetadata = {
  name: MilestoneName | AwardName,
  description: string,
};
