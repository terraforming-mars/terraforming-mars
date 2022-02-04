import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Gardener implements IMilestone {
  public name: string = 'Gardener';
  public description: string = 'Owning at least 3 greenery tiles';
  public getScore(player: Player): number {
    return player.game.getGreeneriesCount(player);
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
