import {CardName} from '../common/cards/CardName';
import {Resources} from '../common/Resources';
import {Tag} from '../common/cards/Tag';

export type SerializedCard = {
  allTags?: Array<Tag>; // For Aridor
  bonusResource?: Resources | Array<Resources>; // For Robotic Workforce / Mining Area / Mining Rights / Specialized Settlement
  cloneTag?: Tag; // For Pathfinders' clone tag
  isDisabled?: boolean; // For Pharmacy Union
  name: CardName;
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export type SerializedRobotCard = {
  card: SerializedCard;
  resourceCount: number;
}
