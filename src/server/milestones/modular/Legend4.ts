import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Legend4 extends BaseMilestone {
  constructor() {
    super(
      'Legend4',
      'Have 4 cards in your event pile',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }
}
