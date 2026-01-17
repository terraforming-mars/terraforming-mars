import {IPlayer} from '@/server/IPlayer';
import {MoonExpansion} from '@/server/moon/MoonExpansion';
import {GlobalParameterRequirement} from '@/server/cards/requirements/GlobalParameterRequirement';
import {GlobalParameter} from '@/common/GlobalParameter';
import {RequirementType} from '@/common/cards/RequirementType';

/**
 * Evaluate whether the game's Moon habitat rate is at least (or at most) a given value.
 */
export class HabitatRateRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.HABITAT_RATE;
  protected readonly parameter = GlobalParameter.MOON_HABITAT_RATE;

  public getGlobalValue(player: IPlayer) {
    return MoonExpansion.moonData(player.game).habitatRate;
  }
}

