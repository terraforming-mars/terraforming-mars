import {Color} from '../../common/Color';

export type SerializedDeltaPlayerProgress = {
  position: number;
  claimed2VP: boolean;
  claimed5VP: boolean;
  jovianBonus: boolean;
}

export type SerializedDeltaProjectData = {
  players: Partial<Record<Color, SerializedDeltaPlayerProgress>>;
}
