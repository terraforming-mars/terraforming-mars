import {IPlayer} from '../../IPlayer';
import {GlobalParameterRequirement} from './GlobalParameterRequirement';
import {MAX_OCEAN_TILES} from '../../../common/constants';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {RequirementType} from '../../../common/cards/RequirementType';
import {Options} from './CardRequirement';

export class OceanRequirement extends GlobalParameterRequirement {
  public readonly type = RequirementType.OCEANS;
  protected readonly parameter = GlobalParameter.OCEANS;

  constructor(amount: number, options?: Options) {
    if (amount <= 0 || amount > MAX_OCEAN_TILES) {
      throw new Error('Ocean tiles must be above 0 and below ' + MAX_OCEAN_TILES);
    }
    super(amount, options);
  }

  public getGlobalValue(player: IPlayer) {
    return player.game.board.getOceanSpaces({upgradedOceans: true, wetlands: true}).length;
  }
}
