import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {GlobalParameter} from '@/common/GlobalParameter';

export abstract class GlobalParameterRequirement extends InequalityRequirement implements ICardRequirement {
  protected scale: number = 1;
  protected abstract parameter: GlobalParameter;

  public getScore(player: Player): number {
    const playerRequirementsBonus = player.getRequirementsBonus(this.parameter) * this.scale;

    const level = this.getGlobalValue(player);

    if (this.isMax) {
      return level - playerRequirementsBonus;
    } else {
      return level + playerRequirementsBonus;
    }
  }

  public abstract getGlobalValue(player: Player): number;
}
