
import {Player} from './Player';
import {IMilestone} from './milestones/IMilestone';

export interface ClaimedMilestone {
    milestone: IMilestone;
    player: Player;
}
