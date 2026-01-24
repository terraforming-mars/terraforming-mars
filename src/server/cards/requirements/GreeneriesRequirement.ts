import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

/**
 * Evaluate whether the number of greenery tiles on Mars is at least (or at most) a given value.
 *
 * Can apply to a single player's tiles or all tiles.
 */
export class GreeneriesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.GREENERIES;
  public override getScore(player: IPlayer): number {
    return player.game.board.getGreeneries(this.all ? undefined : player).length;
  }
}
