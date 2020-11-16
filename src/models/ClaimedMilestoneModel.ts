import {IMilestone} from '../milestones/IMilestone';
import {Color} from '../Color';

export interface IMilestoneScore {
    playerColor: Color;
    playerScore: number;
}

export interface ClaimedMilestoneModel {
    milestone: IMilestone;
    player_name: string;
    player_color: string;
    scores: Array<IMilestoneScore>;
}
