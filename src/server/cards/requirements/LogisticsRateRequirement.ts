import {Player} from '../../Player';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';

export class LogisticsRateRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.LOGISTIC_RATE;
  protected readonly parameter = GlobalParameter.MOON_LOGISTICS_RATE;

  public getGlobalValue(player: Player) {
    return MoonExpansion.moonData(player.game).logisticRate;
  }
}
