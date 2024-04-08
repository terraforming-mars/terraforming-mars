import {IPlayer} from '../../IPlayer';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {MAX_TEMPERATURE, MIN_TEMPERATURE} from '../../../common/constants';
import {Options} from './CardRequirement';

/**
 * Evaluate whether the game's temperature is at least (or at most) a given value.
 */
export class TemperatureRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.TEMPERATURE;
  protected readonly parameter = GlobalParameter.TEMPERATURE;
  protected override readonly scale = 2;

  constructor(options?: Partial<Options>) {
    const count = options?.count ?? 1;
    if (count < MIN_TEMPERATURE || count > MAX_TEMPERATURE) {
      throw new Error('Temperature must be above ' + MIN_TEMPERATURE + ' and below ' + MAX_TEMPERATURE);
    }
    if (count % 2 !== 0) {
      throw new Error('Temperature must be even');
    }
    super(options);
  }

  public getGlobalValue(player: IPlayer) {
    return player.game.getTemperature();
  }
}
