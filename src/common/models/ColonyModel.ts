import {ColonyName} from '../colonies/ColonyName';
import {Color} from '../Color';

export type ColonyModel = {
  colonies: Array<Color>;
  isActive: boolean;
  name: ColonyName;
  trackPosition: number;
  visitor: Color | undefined;
}

export function simpleColonyModel(name: ColonyName): ColonyModel {
  return {
    colonies: [],
    isActive: false,
    name: name,
    trackPosition: 0,
    visitor: undefined,
  };
}
