import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {YesAnd} from './CardRequirement';

export abstract class GlobalParameterRequirement extends InequalityRequirement {
  protected scale: number = 1;
  protected abstract parameter: GlobalParameter;

  public abstract getGlobalValue(player: IPlayer): number;

  public override satisfies(player: IPlayer, thinkTankResources: number): boolean | YesAnd {
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

  public getScore(player: IPlayer): number {
    const playerRequirementsBonus = player.getGlobalParameterRequirementBonus(this.parameter) * this.scale;

    const level = this.getGlobalValue(player);

    if (this.max) {
      return level - playerRequirementsBonus;
    } else {
      return level + playerRequirementsBonus;
    }
  }

  public distance(player: IPlayer): number {
    return Math.floor(Math.abs(this.getScore(player) - this.count) / this.scale);
  }
}
