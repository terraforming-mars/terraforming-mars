
import {Color} from '../Color';
import {AwardName} from '../ma/AwardName';

export type AwardScore = {
  playerColor: Color;
  playerScore: number;
}

export type FundedAwardModel = {
  name: AwardName;
  description: string;
  player_name: string;
  player_color: string;
  scores: Array<AwardScore>;
}
