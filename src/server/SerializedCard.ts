import {CardName} from '../common/cards/CardName';
import {Resource} from '../common/Resource';
import {Tag} from '../common/cards/Tag';
import {OneOrArray} from '../common/utils/types';
import {JSONValue} from '../common/Types';

export type SerializedCard = {
  allTags?: Array<Tag>; // For Aridor
  bonusResource?: OneOrArray<Resource>; // For Robotic Workforce / Mining Area / Mining Rights / Specialized Settlement
  cloneTag?: Tag; // For Pathfinders' clone tag
  data?: JSONValue;
  generationUsed?: number; // For CEO and Underworld Cards.
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
