import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class GreeneriesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.GREENERIES;
  public override getScore(player: IPlayer): number {
    return player.game.board.getGreeneries(this.isAny ? undefined : player).length;
  }
}
