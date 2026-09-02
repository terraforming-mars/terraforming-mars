import {IPlayer} from '../../IPlayer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';

/**
 * Evaluate whether the game's Moon logistic rate is at least (or at most) a given value.
 */
export class LogisticRateRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.LOGISTIC_RATE;
  protected readonly parameter = GlobalParameter.MOON_LOGISTIC_RATE;

  public getGlobalValue(player: IPlayer) {
    return MoonExpansion.moonData(player.game).logisticRate;
  }
}
