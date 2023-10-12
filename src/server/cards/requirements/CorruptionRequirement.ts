import {IPlayer} from '../../IPlayer';
import {RequirementType} from '../../../common/cards/RequirementType';
import {InequalityRequirement} from './InequalityRequirement';

export class CorruptionRequirement extends InequalityRequirement {
  public readonly type = RequirementType.CORRUPTION;

  public getScore(player: IPlayer): number {
    return player.underworldData.corruption;
  }
}

