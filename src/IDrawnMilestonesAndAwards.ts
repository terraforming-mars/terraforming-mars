import {IAward} from './awards/IAward';
import {IMilestone} from './milestones/IMilestone';

export interface IDrawnMilestonesAndAwards {
  milestones: Array<IMilestone>,
  awards: Array<IAward>
};
