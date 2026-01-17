import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class Ecologist extends BaseMilestone {
  constructor() {
    super(
      'Ecologist',
      'Have 4 bio tags in play (plant, microbe and animal tags count as bio tags)',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.PLANT, Tag.ANIMAL, Tag.MICROBE], 'milestone');
  }
}
