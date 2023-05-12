import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Ecologist extends BaseMilestone {
  constructor() {
    super(
      'Ecologist',
      'Have 4 bio tags (plant, microbe and animal tags count as bio tags)',
      4);
  }
  public getScore(player: Player): number {
    const tags: Array<Tag> = [Tag.PLANT, Tag.ANIMAL, Tag.MICROBE];
    return player.tags.multipleCount(tags, 'milestone');
  }
}
