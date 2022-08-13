import {CardName} from '../common/cards/CardName';
import {Resources} from '../common/Resources';
import {Tags} from '../common/cards/Tags';

export type SerializedCard = {
  allTags?: Array<Tags>; // For Aridor
  bonusResource?: Resources | Array<Resources>; // For Robotic Workforce / Mining Area / Mining Rights / Specialized Settlement
  cloneTag?: Tags; // For Pathfinders' clone tag
  isDisabled?: boolean; // For Pharmacy Union
  name: CardName;
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export type SerializedRobotCard = {
  card: SerializedCard;
  resourceCount: number;
}
