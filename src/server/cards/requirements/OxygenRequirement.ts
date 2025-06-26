import {IPlayer} from '../../IPlayer';
import {Options} from './CardRequirement';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {MAX_OXYGEN_LEVEL, MIN_OXYGEN_LEVEL} from '../../../common/constants';

/**
 * Evaluate whether the game's oxygel level is at least (or at most) a given value.
 */
export class OxygenRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.OXYGEN;
  protected readonly parameter = GlobalParameter.OXYGEN;
  protected override readonly scale = 1;

  constructor(options?: Partial<Options>) {
    const count = options?.count ?? 1;
    if (count < MIN_OXYGEN_LEVEL || count > MAX_OXYGEN_LEVEL) {
      throw new Error('Oxygen must be above ' + MIN_OXYGEN_LEVEL + ' and below ' + MAX_OXYGEN_LEVEL);
    }
    super(options);
  }

  public getGlobalValue(player: IPlayer) {
    return player.game.getOxygenLevel();
  }
}
