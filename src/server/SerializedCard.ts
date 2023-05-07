import {CardName} from '../common/cards/CardName';
import {Resource} from '../common/Resource';
import {Tag} from '../common/cards/Tag';

export type SerializedCard = {
  allTags?: Array<Tag>; // For Aridor
  bonusResource?: Resource | Array<Resource>; // For Robotic Workforce / Mining Area / Mining Rights / Specialized Settlement
  cloneTag?: Tag; // For Pathfinders' clone tag
  isDisabled?: boolean; // For Pharmacy Union and CEO Cards.
  name: CardName;
  opgActionIsActive?: boolean; // For CEO Cards.
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export type SerializedRobotCard = {
  card: SerializedCard;
  resourceCount: number;
}
