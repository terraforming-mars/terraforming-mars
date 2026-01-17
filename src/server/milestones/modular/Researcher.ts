import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class Researcher extends BaseMilestone {
  constructor() {
    super(
      'Researcher',
      'Have 4 science tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SCIENCE, 'milestone');
  }
}
