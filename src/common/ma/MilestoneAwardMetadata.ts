import {MilestoneName} from './MilestoneName';
import {AwardName} from './AwardName';

export type MilestoneMetadata = {
  name: MilestoneName,
  description: string,
};

export type AwardMetadata = {
  name: AwardName,
  description: string,
};
