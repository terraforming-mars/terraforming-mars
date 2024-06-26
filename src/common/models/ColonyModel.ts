import {ColonyName} from '../colonies/ColonyName';
import {Color} from '../Color';

export type ColonyModel = {
  colonies: Array<Color>;
  isActive: boolean;
  name: ColonyName;
  trackPosition: number;
  visitor: Color | undefined;
}
