import {Color} from '../Color';

export interface IMilestoneScore {
    playerColor: Color;
    playerScore: number;
}

export interface ClaimedMilestoneModel {
    name: string;
    description: string;
    player_name: string;
    player_color: string;
    scores: Array<IMilestoneScore>;
}
