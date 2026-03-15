import {Color} from '../Color';

export type DeltaProjectModel = {
  playerPositions: Partial<Record<Color, number>>;
  claimed2VP: ReadonlyArray<Color>;
  claimed5VP: ReadonlyArray<Color>;
  jovianBonus: ReadonlyArray<Color>;
}
