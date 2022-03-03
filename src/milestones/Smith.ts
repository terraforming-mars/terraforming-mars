import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Resources} from '../common/Resources';

export class Smith implements IMilestone {
  public name: string = 'Smith';
  public description: string = 'Have a total of at least 7 steel and titanium production';

  public getScore(player: Player): number {
    return player.getProduction(Resources.STEEL) + player.getProduction(Resources.TITANIUM);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 7;
  }
}
