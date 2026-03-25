import {Color} from '../Color';
import {AwardName} from '../ma/AwardName';

export type AwardScore = {
  color: Color;
  score: number;
}

export type FundedAwardModel = {
  name: AwardName;
  playerName: string | undefined;
  color: Color | undefined;
  scores: Array<AwardScore>;
}
