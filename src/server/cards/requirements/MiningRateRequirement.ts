import {IPlayer} from '../../IPlayer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';

/**
 * Evaluate whether the game's Moon mining rate is at least (or at most) a given value.
 */
export class MiningRateRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.MINING_RATE;
  protected readonly parameter = GlobalParameter.MOON_MINING_RATE;

  public getGlobalValue(player: IPlayer) {
    return MoonExpansion.moonData(player.game).miningRate;
  }
}
