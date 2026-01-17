import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class RimSettler extends BaseMilestone {
  constructor() {
    super(
      'Rim Settler',
      'Have 3 Jovian tags in play',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.JOVIAN, 'milestone');
  }
}
