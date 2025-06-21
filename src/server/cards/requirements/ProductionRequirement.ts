import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

/**
 * Evaluate whether a player's resource production is at least (or at most) a given value.
 *
 * (e.g. player has 1 steel production.)
 */
export class ProductionRequirement extends InequalityRequirement {
  public readonly type = RequirementType.PRODUCTION;
  public readonly resource: Resource;
  constructor(resource: Resource, options?: Partial<Options>) {
    super(options);
    if (resource === Resource.PLANTS) {
      throw new Error(
        'This error can be removed once the card is made compatible with Ecology Experts');
    }
    this.resource = resource;
  }
  public getScore(player: IPlayer): number {
    return player.production[this.resource];
  }
}
