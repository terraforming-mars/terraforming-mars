import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {YesAnd} from './CardRequirement';

export abstract class GlobalParameterRequirement extends InequalityRequirement implements ICardRequirement {
  protected scale: number = 1;
  protected abstract parameter: GlobalParameter;

  public abstract getGlobalValue(player: Player): number;

  public override satisfies(player: Player, thinkTankResources: number): boolean | YesAnd {
    if (super.satisfies(player, thinkTankResources)) {
      return true;
    }
    if (thinkTankResources) {
      const distance = this.distance(player);
      if (distance <= thinkTankResources) {
        return {ok: true, thinkTankResources: distance};
      }
    }
    return false;
  }

  public getScore(player: Player): number {
    const playerRequirementsBonus = player.getRequirementsBonus(this.parameter) * this.scale;

    const level = this.getGlobalValue(player);

    if (this.isMax) {
      return level - playerRequirementsBonus;
    } else {
      return level + playerRequirementsBonus;
    }
  }

  public distance(player: Player): number {
    return Math.floor(Math.abs(this.getScore(player) - this.amount) / this.scale);
  }
}
