
import {Color} from '../Color';

export type AwardScore = {
  playerColor: Color;
  playerScore: number;
}

export type FundedAwardModel = {
  name: string;
  description: string;
  player_name: string;
  player_color: string;
  scores: Array<AwardScore>;
}
