import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Legend extends BaseMilestone {
  constructor() {
    super(
      'Legend',
      'Have 5 cards in your event pile',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }
}
