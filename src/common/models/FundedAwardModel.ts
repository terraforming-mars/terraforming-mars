
import {Color} from '../Color';
import {AwardName} from '../ma/AwardName';

export type AwardScore = {
  playerColor: Color;
  playerScore: number;
}

export type FundedAwardModel = {
  name: AwardName;
  playerName: string;
  playerColor: Color | '';
  scores: Array<AwardScore>;
}
