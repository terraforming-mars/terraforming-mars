import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Planner extends BaseMilestone {
  constructor() {
    super(
      'Planner',
      'Have 16 cards in your hand',
      16);
  }
  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }
}
