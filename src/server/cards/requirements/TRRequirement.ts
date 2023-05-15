import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class TRRequirement extends InequalityRequirement {
  public readonly type = RequirementType.TR;
  public override getScore(player: Player): number {
    return player.getTerraformRating();
  }
}
