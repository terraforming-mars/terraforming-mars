import {IPlayer} from '../../IPlayer';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {MAX_OCEAN_TILES} from '../../../common/constants';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {Options} from './CardRequirement';

/**
 * Evaluate whether the game's ocean tile count is at least (or at most) a given value.
 */
export class OceanRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.OCEANS;
  protected readonly parameter = GlobalParameter.OCEANS;

  constructor(options?: Partial<Options>) {
    const count = options?.count ?? 1;
    if (count <= 0 || count > MAX_OCEAN_TILES) {
      throw new Error('Ocean tiles must be above 0 and below ' + MAX_OCEAN_TILES);
    }
    super(options);
  }

  public getGlobalValue(player: IPlayer) {
    return player.game.board.getOceanSpaces({upgradedOceans: true, wetlands: true}).length;
  }
}
