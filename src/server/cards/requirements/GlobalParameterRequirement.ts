import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {CardName} from '../../../common/cards/CardName';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';


/**
 * Defines the class of requirements that compare against global parameters. Subclasses define
 * important attributes of how each global paramter functions (e.g. `OxygenRequirement`.)
 *
 * For the most part, this is not much different than `InequalityRequirement` but the
 * Pathfinders card Think Tank adds most of the complexity.
 */
export abstract class GlobalParameterRequirement extends InequalityRequirement {
  protected scale: number = 1;
  protected abstract parameter: GlobalParameter;

  public abstract getGlobalValue(player: IPlayer): number;

  public override satisfies(player: IPlayer, card: IProjectCard): boolean {
    if (super.satisfies(player, card)) {
      return true;
    }
    const aeronGenomicsResources = (card.resourceType === CardResource.ANIMAL) ?
      (player.tableau.get(CardName.AERON_GENOMICS)?.resourceCount ?? 0):
      0;
    const thinkTankResources = player.tableau.get(CardName.THINK_TANK)?.resourceCount ?? 0;
    const sum = aeronGenomicsResources + thinkTankResources;
    if (sum > 0) {
      const distance = this.distance(player);
      if (distance <= sum) {
        card.additionalProjectCosts = card.additionalProjectCosts ?? {};
        const animals = Math.min(distance, aeronGenomicsResources);
        const data = Math.min(distance - aeronGenomicsResources, thinkTankResources);
        if (animals > 0) {
          card.additionalProjectCosts.aeronGenomicsResources = animals;
        }
        if (data > 0) {
          card.additionalProjectCosts.thinkTankResources = data;
        }
        return true;
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
