import {IPlayer} from '../../IPlayer';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {MAX_VENUS_SCALE, MIN_VENUS_SCALE} from '../../../common/constants';
import {Options} from './CardRequirement';

/**
 * Evaluate whether the game's venus scale level is at least (or at most) a given value.
 */
export class VenusRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.VENUS;
  protected readonly parameter = GlobalParameter.VENUS;
  protected override readonly scale = 2;

  constructor(options?: Partial<Options>) {
    const count = options?.count ?? 1;
    if (count < MIN_VENUS_SCALE || count > MAX_VENUS_SCALE) {
      throw new Error('Venus must be above ' + MIN_VENUS_SCALE + ' and below ' + MAX_VENUS_SCALE);
    }
    super(options);
  }

  public getGlobalValue(player: IPlayer) {
    return player.game.getVenusScaleLevel();
  }
}
