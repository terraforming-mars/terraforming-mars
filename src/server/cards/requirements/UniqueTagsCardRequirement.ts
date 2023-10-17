import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class UniqueTagsCardRequirement extends InequalityRequirement {
  public readonly type = RequirementType.SUM_TAGS;
  constructor(options?: Partial<Options>) {
    super(options);
  }

  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('default');
  }
}