
import {IAward} from '../awards/IAward';
import {Color} from '../Color';

export interface IAwardScore {
    playerColor: Color;
    playerScore: number;
}

export interface FundedAwardModel {
    award: IAward;
    player_name: string;
    player_color: string;
    scores: Array<IAwardScore>;
}
