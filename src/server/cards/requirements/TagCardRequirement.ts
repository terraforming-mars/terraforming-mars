import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {InequalityRequirement} from './InequalityRequirement';
import {Options} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class TagCardRequirement extends InequalityRequirement {
  public readonly type = RequirementType.TAG;
  public readonly tag: Tag;
  constructor(tag: Tag, options?: Partial<Options>) {
    super(options);
    this.tag = tag;
  }

  public getScore(player: IPlayer): number {
    const mode = this.max !== true ? 'default' : 'raw';
    let tagCount = player.tags.count(this.tag, mode);

    if (this.all) {
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
