import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Ecologist implements IMilestone {
  public readonly name = 'Ecologist';
  public readonly description = 'Requires that you have 4 bio tags (plant, microbe and animal tags count as bio tags)';
  public getScore(player: Player): number {
    const tags: Array<Tag> = [Tag.PLANT, Tag.ANIMAL, Tag.MICROBE];
    return player.tags.multipleCount(tags, 'milestones');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
