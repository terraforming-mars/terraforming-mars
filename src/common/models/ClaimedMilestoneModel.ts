import {Color} from '../Color';
import {MilestoneName} from '../ma/MilestoneName';

export type MilestoneScore = {
    playerColor: Color;
    playerScore: number;
}

export type ClaimedMilestoneModel = {
    name: MilestoneName;
    player_name: string;
    player_color: string;
    scores: Array<MilestoneScore>;
}
