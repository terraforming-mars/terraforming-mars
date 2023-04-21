import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Legend extends BaseMilestone {
  constructor() {
    super(
      'Legend',
      'Requires that you have played 5 events',
      5);
  }
  public getScore(player: Player): number {
    return player.getPlayedEventsCount();
  }
}
