import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class GenerationRequirement extends InequalityRequirement {
  public readonly type = RequirementType.GENERATION;
  public override getScore(player: IPlayer): number {
    return player.game.generation;
  }
}
