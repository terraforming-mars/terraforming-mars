import {Player} from '../../Player';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {MAX_VENUS_SCALE, MIN_VENUS_SCALE} from '../../../common/constants';
import {Options} from './CardRequirement';

export class VenusRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.VENUS;
  protected readonly parameter = GlobalParameter.VENUS;
  protected override readonly scale = 2;

  constructor(amount: number, options?: Options) {
    if (amount < MIN_VENUS_SCALE || amount > MAX_VENUS_SCALE) {
      throw new Error('Venus must be above ' + MIN_VENUS_SCALE + ' and below ' + MAX_VENUS_SCALE);
    }
    super(amount, options);
  }

  public getGlobalValue(player: Player) {
    return player.game.getVenusScaleLevel();
  }
}
