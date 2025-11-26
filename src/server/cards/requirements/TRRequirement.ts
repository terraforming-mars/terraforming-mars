import {IPlayer} from '@/server/IPlayer';
import {InequalityRequirement} from '@/server/cards/requirements/InequalityRequirement';
import {RequirementType} from '@/common/cards/RequirementType';

/**
 * Evaluate whether a player has least (or at most) a given TR.
 */
export class TRRequirement extends InequalityRequirement {
  public readonly type = RequirementType.TR;
  public override getScore(player: IPlayer): number {
    return player.terraformRating;
  }
}
