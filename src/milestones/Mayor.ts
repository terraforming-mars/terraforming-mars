import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Mayor implements IMilestone {
  public name: string = 'Mayor';
  public description: string = 'Owning at least 3 city tiles';
  public getScore(player: Player): number {
    return player.game.getCitiesCount(player);
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
