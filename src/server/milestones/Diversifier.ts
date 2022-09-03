import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Diversifier implements IMilestone {
  public readonly name = 'Diversifier';
  public readonly description = 'Requires that you have 8 different tags in play';
  public getScore(player: Player): number {
    return player.tags.distinctCount('milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 8;
  }
}
