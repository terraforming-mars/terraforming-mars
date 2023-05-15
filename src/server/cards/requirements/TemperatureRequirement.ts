import {Player} from '../../Player';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {MAX_TEMPERATURE, MIN_TEMPERATURE} from '../../../common/constants';
import {Options} from './CardRequirement';

export class TemperatureRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.TEMPERATURE;
  protected readonly parameter = GlobalParameter.OCEANS;
  protected override readonly scale = 2;

  constructor(amount: number, options?: Options) {
    if (amount < MIN_TEMPERATURE || amount > MAX_TEMPERATURE) {
      throw new Error('Temperature must be above ' + MIN_TEMPERATURE + ' and below ' + MAX_TEMPERATURE);
    }
    if (amount % 2 !== 0) {
      throw new Error('Temperature must be even');
    }
    super(amount, options);
  }

  public getGlobalValue(player: Player) {
    return player.game.getTemperature();
  }
}
