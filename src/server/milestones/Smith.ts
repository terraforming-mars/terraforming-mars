import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Smith implements IMilestone {
  public name: string = 'Smith';
  public description: string = 'Have a total of at least 7 steel and titanium production';

  public getScore(player: Player): number {
    return player.production.steel + player.production.titanium;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 7;
  }
}
