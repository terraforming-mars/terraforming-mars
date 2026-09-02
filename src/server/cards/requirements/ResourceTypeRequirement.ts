import {ALL_RESOURCES} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';


/**
 * Evaluate whether the number of different resource types a player has is at least (or at most) a given value.
 *
 * This applies (as of this time) exclusively to the card Diversity Support.
 */
export class ResourceTypeRequirement extends InequalityRequirement {
  public readonly type = RequirementType.RESOURCE_TYPES;
  public override getScore(player: IPlayer): number {
    const standardResources = ALL_RESOURCES.filter((res) => player.stock.get(res) > 0).length;
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType)).size;
    const corruption = player.underworldData.corruption > 0 ? 1 : 0;
    return standardResources + nonStandardResources + corruption;
  }
}
