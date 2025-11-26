import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class Martian extends BaseMilestone {
  constructor() {
    super(
      'Martian',
      'Have 4 Mars tags in play',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.MARS, 'milestone');
  }
}
