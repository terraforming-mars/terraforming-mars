import {CardName} from './CardName';
import {Resources} from './Resources';
import {Tags} from './cards/Tags';

export interface SerializedCard {
  allTags?: Array<Tags>;
  bonusResource?: (Resources.STEEL | Resources.TITANIUM) | Array<Resources.STEEL | Resources.TITANIUM>;
  isDisabled?: boolean;
  name: CardName;
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export interface SerializedRobotCard {
  card: SerializedCard;
  resourceCount: number;
}
