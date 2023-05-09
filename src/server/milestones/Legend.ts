import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Legend extends BaseMilestone {
  constructor() {
    super(
      'Legend',
      'Have played 5 events',
      5);
  }
  public getScore(player: Player): number {
    // TODO(kberg): include events removed by Odyssey and Playwrights?
    return player.getPlayedEventsCount();
  }
}
