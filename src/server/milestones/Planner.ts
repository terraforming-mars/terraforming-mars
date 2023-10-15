import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

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
