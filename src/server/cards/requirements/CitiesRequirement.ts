import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class CitiesRequirement extends InequalityRequirement {
  public readonly type = RequirementType.CITIES;
  public override getScore(player: IPlayer): number {
    return player.game.getCitiesCount(this.isAny ? undefined : player);
  }
}
