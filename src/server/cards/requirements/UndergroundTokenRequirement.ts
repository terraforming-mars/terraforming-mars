import {IPlayer} from '../../IPlayer';
import {RequirementType} from '../../../common/cards/RequirementType';
import {InequalityRequirement} from './InequalityRequirement';

/**
 * Evaluates whether this player has excavated a given number of tiles.
 */
export class UndergroundTokenRequirement extends InequalityRequirement {
  public readonly type = RequirementType.UNDERGROUND_TOKENS;

  public getScore(player: IPlayer): number {
    return player.underworldData.tokens.length;
  }
}

