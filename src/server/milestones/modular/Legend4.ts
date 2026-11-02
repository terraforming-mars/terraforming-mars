import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Legend4 extends BaseMilestone {
  public readonly automaDescription = '4+ red cards in played pile';
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
