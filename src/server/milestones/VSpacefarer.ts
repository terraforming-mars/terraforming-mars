import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {BaseMilestone} from '@/server/milestones/IMilestone';

export class VSpacefarer extends BaseMilestone {
  constructor() {
    super(
      'V. Spacefarer',
      'Have 4 space tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SPACE, 'milestone');
  }
}
