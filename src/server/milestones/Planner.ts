import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Planner extends BaseMilestone {
  constructor() {
    super(
      'Planner',
      'Having at least 16 cards in your hand when you claim this milestone',
      16);
  }
  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }
}
