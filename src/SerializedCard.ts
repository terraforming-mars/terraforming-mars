import {CardName} from './CardName';
import {Resources} from './common/Resources';
import {Tags} from './common/cards/Tags';

export interface SerializedCard {
  allTags?: Array<Tags>; // For Aridor
  bonusResource?: Resources | Array<Resources>; // For Robotic Workforce / Mining Area / Mining Rights
  cloneTag?: Tags; // For Pathfinders' clone tag
  isDisabled?: boolean; // For Pharmacy Union
  name: CardName;
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export interface SerializedRobotCard {
  card: SerializedCard;
  resourceCount: number;
}
