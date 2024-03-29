import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';


/**
 * Defines the class of requirements that compare against global parameters. Subclasses define
 * important attributes of how each global paramter functions (e.g. `OxygenRequirement`.)
 */
export abstract class GlobalParameterRequirement extends InequalityRequirement {
  protected scale: number = 1;
  protected abstract parameter: GlobalParameter;

  public abstract getGlobalValue(player: IPlayer): number;

  public getScore(player: IPlayer): number {
    const playerRequirementsBonus = player.getGlobalParameterRequirementBonus(this.parameter) * this.scale;

    const level = this.getGlobalValue(player);

    if (this.max) {
      return level - playerRequirementsBonus;
    } else {
      return level + playerRequirementsBonus;
    }
  }
}
