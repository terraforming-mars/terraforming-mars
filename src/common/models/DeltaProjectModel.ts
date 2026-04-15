import {Color} from '../Color';

export type DeltaProjectPlayerModel = {
  position: number;
  jovianBonus: boolean;
}

export type DeltaProjectModel = {
  players: Partial<Record<Color, DeltaProjectPlayerModel>>;
}
