import {CardName} from './CardName';
import {Resources} from './Resources';
import {Tags} from './cards/Tags';

export interface SerializedCard {
  name: CardName;
  resourceCount?: number;
  allTags?: Array<Tags>;
  targetCards?: Array<SerializedRobotCard>;
  isDisabled?: boolean;
  bonusResource?: Resources;
}

export interface SerializedRobotCard {
  card: SerializedCard;
  resourceCount: number;
}
