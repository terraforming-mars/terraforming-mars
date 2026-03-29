import {Color} from '../Color';

export type DeltaPlayerProgressModel = {
  position: number;
  claimed2VP: boolean;
  claimed5VP: boolean;
  jovianBonus: boolean;
}

export type DeltaProjectModel = {
  players: Partial<Record<Color, DeltaPlayerProgressModel>>;
}
