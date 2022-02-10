import {Color} from '../Color';

export interface ColonyModel {
  colonies: Array<Color>;
  isActive: boolean;
  name: string;
  trackPosition: number;
  visitor: Color | undefined;
}
