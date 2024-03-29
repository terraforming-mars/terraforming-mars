import {ColonyName} from '../colonies/ColonyName';
import {Color} from '../Color';

export interface ColonyModel {
  colonies: Array<Color>;
  name: ColonyName;
  isActive: boolean;
  trackPosition: number;
  visitor: Color | undefined;
}
