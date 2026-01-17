import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Planner extends BaseMilestone {
  constructor() {
    super(
      'Planner',
      'Have 16 cards in your hand',
      16);
  }
  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }
}
