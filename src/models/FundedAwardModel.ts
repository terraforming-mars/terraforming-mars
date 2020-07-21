
import {IAward  } from "../awards/IAward";

export interface IAwardScore {
    playerName: string;
    playerScore: number;
}

export interface FundedAwardModel {
    award: IAward;
    player_name: string;
    player_color: string;
    scores: Array<IAwardScore>;
}
