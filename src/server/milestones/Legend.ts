import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

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
