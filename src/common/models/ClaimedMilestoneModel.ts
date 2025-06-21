import {Color} from '../Color';
import {MilestoneName} from '../ma/MilestoneName';

export type MilestoneScore = {
  playerColor: Color;
  playerScore: number;
}

export type ClaimedMilestoneModel = {
  name: MilestoneName;
  playerName: string | undefined;
  playerColor: Color | undefined;
  scores: Array<MilestoneScore>;
}
