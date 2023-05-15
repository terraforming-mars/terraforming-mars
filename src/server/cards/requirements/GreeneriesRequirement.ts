import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class GreeneriesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.GREENERIES;
  public override getScore(player: Player): number {
    return player.game.getGreeneriesCount(this.isAny ? undefined : player);
  }
}
