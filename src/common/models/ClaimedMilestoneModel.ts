import {Color} from '../Color';

export type MilestoneScore = {
    playerColor: Color;
    playerScore: number;
}

export type ClaimedMilestoneModel = {
    name: string;
    description: string;
    player_name: string;
    player_color: string;
    scores: Array<MilestoneScore>;
}
