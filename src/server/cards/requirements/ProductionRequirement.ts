import {IProductionCardRequirement} from '../../../common/cards/ICardRequirement';
import {Resource} from '../../../common/Resource';
import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class ProductionRequirement extends InequalityRequirement implements IProductionCardRequirement {
  public readonly type = RequirementType.PRODUCTION;
  public readonly resource: Resource;
  constructor(resource: Resource, amount: number, options?: Options) {
    super(amount, options);
    this.resource = resource;
  }
  public getScore(player: Player): number {
    return player.production[this.resource];
  }
}
