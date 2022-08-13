import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Diversifier implements IMilestone {
  public name: string = 'Diversifier';
  public description: string = 'Requires that you have 8 different tags in play';
  public getScore(player: Player): number {
    return player.getDistinctTagCount('milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 8;
  }
}
