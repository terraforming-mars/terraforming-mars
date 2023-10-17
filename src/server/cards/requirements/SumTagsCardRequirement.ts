import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class SumTagsCardRequirement extends InequalityRequirement {
  public readonly type = RequirementType.SUM_TAGS;
  public readonly tags: Array<Tag>;
  constructor(tags: Array<Tag>, options?: Partial<Options>) {
    super(options);
    this.tags = tags;
  }

  public getScore(player: IPlayer): number {
    let tagCount = player.tags.multipleCount(this.tags);

    // PoliticalAgendas Scientists P4 hook
    if (this.tags.includes(Tag.SCIENCE) && player.hasTurmoilScienceTagBonus) tagCount += 1;

    return tagCount;
  }
}