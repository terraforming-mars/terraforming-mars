import {IPlayer} from '@/server/IPlayer';
import {RequirementType} from '@/common/cards/RequirementType';
import {InequalityRequirement} from '@/server/cards/requirements/InequalityRequirement';

/**
 * Evaluates whether this player (or all players) has a given number of cities on Mars.
 */
export class CorruptionRequirement extends InequalityRequirement {
  public readonly type = RequirementType.CORRUPTION;

  public getScore(player: IPlayer): number {
    return player.underworldData.corruption;
  }
}

