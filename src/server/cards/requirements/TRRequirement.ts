import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class TRRequirement extends InequalityRequirement {
  public readonly type = RequirementType.TR;
  public override getScore(player: IPlayer): number {
    return player.getTerraformRating();
  }
}
