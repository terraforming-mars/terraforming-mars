import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {BaseMilestone} from '@/server/milestones/IMilestone';

export class Agronomist extends BaseMilestone {
  constructor() {
    super(
      'Agronomist',
      'Have 4 plant tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.PLANT);
  }
}
