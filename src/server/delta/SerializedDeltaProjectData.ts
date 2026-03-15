import {Color} from '../../common/Color';

export type SerializedDeltaProjectData = {
  playerPositions: Partial<Record<Color, number>>;
  claimed2VP: Array<Color>;
  claimed5VP: Array<Color>;
  jovianBonus: Array<Color>;
}
