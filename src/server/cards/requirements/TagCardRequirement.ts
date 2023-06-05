import {Tag} from '../../../common/cards/Tag';
import {ITagCardRequirement} from '../../../common/cards/ICardRequirement';
import {Player} from '../../Player';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class TagCardRequirement extends InequalityRequirement implements ITagCardRequirement {
  public readonly type = RequirementType.TAG;
  public readonly tag: Tag;
  constructor(tag: Tag, amount: number, options?: Options) {
    super(amount, options);
    this.tag = tag;
  }

  public getScore(player: Player): number {
    const mode = this.isMax !== true ? 'default' : 'raw';
    let tagCount = player.tags.count(this.tag, mode);

    if (this.isAny) {
      player.game.getPlayers().forEach((p) => {
        if (p.id !== player.id) {
          // Don't include opponents' wild tags because they are not performing the action.
          tagCount += p.tags.count(this.tag, 'raw');
        }
      });
    }
    // PoliticalAgendas Scientists P4 hook
    if (this.tag === Tag.SCIENCE && player.hasTurmoilScienceTagBonus) tagCount += 1;

    return tagCount;
  }
}
