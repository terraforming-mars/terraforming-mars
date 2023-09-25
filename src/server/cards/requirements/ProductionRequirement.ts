import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class ProductionRequirement extends InequalityRequirement {
  public readonly type = RequirementType.PRODUCTION;
  public readonly resource: Resource;
  constructor(resource: Resource, options?: Partial<Options>) {
    super(options);
    this.resource = resource;
  }
  public getScore(player: IPlayer): number {
    return player.production[this.resource];
  }
}
