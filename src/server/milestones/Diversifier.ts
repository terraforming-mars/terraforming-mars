import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Diversifier extends BaseMilestone {
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags in play',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('milestone');
  }
}
