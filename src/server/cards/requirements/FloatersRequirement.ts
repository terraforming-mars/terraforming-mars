import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class FloatersRequirement extends InequalityRequirement {
  public readonly type = RequirementType.FLOATERS;
  public override getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.FLOATER);
  }
}
