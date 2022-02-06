
import {Color} from '../Color';

export interface IAwardScore {
  playerColor: Color;
  playerScore: number;
}

export interface FundedAwardModel {
  name: string;
  description: string;
  player_name: string;
  player_color: string;
  scores: Array<IAwardScore>;
}
