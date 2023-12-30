import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

/**
 * Evaluates whether this player has a number of floaters on their played cards.
 */
export class FloatersRequirement extends InequalityRequirement {
  public readonly type = RequirementType.FLOATERS;
  public override getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.FLOATER);
  }
}
