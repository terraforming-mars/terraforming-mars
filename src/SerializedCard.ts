import {CardName} from './CardName';
import {Tags} from './cards/Tags';

export interface SerializedCard {
  name: CardName;
  resourceCount?: number;
  allTags?: Array<Tags>;
  targetCards?: Array<SerializedRobotCard>;
  isDisabled?: boolean;
}

export interface SerializedRobotCard {
  card: SerializedCard;
  resourceCount: number;
}
