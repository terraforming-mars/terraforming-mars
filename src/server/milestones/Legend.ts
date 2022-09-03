import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Legend implements IMilestone {
  public readonly name = 'Legend';
  public readonly description = 'Requires that you have played 5 events';
  public getScore(player: Player): number {
    return player.getPlayedEventsCount();
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) > 4;
  }
}
