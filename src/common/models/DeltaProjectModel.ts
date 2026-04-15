import {Color} from '../Color';

export type DeltaProjectPlayerModel = {
  position: number;
  claimed2VP: boolean;
  claimed5VP: boolean;
  jovianBonus: boolean;
}

export type DeltaProjectModel = {
  players: Partial<Record<Color, DeltaProjectPlayerModel>>;
}
