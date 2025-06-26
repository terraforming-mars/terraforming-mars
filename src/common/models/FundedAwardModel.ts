import {Color} from '../Color';
import {AwardName} from '../ma/AwardName';

export type AwardScore = {
  playerColor: Color;
  playerScore: number;
}

export type FundedAwardModel = {
  name: AwardName;
  playerName: string | undefined;
  playerColor: Color | undefined;
  scores: Array<AwardScore>;
}
