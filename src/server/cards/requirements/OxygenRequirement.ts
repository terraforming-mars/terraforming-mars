import {IPlayer} from '../../IPlayer';
import {Options} from './CardRequirement';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {MAX_OXYGEN_LEVEL, MIN_OXYGEN_LEVEL} from '../../../common/constants';

export class OxygenRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.OXYGEN;
  protected readonly parameter = GlobalParameter.OXYGEN;
  protected override readonly scale = 1;

  constructor(amount: number, options?: Options) {
    if (amount < MIN_OXYGEN_LEVEL || amount > MAX_OXYGEN_LEVEL) {
      throw new Error('Oxygen must be above ' + MIN_OXYGEN_LEVEL + ' and below ' + MAX_OXYGEN_LEVEL);
    }
    super(amount, options);
  }

  public getGlobalValue(player: IPlayer) {
    return player.game.getOxygenLevel();
  }
}
