import {MilestoneName} from './MilestoneName';
import {AwardName} from './AwardName';

/** Preselected milestones and awards. Only valid when randomMA is MANUAL. */
export type CustomMA = {
  milestones: ReadonlyArray<MilestoneName>;
  awards: ReadonlyArray<AwardName>;
};
