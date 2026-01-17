import {Tag} from '@/common/cards/Tag';
import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Terran extends BaseMilestone {
  constructor() {
    super(
      'Terran',
      'Have 6 Earth tags in play',
      6);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.EARTH, 'milestone');
  }
}
