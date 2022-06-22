import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Resources} from '../common/Resources';

export class Economizer implements IMilestone {
  public name: string = 'Economizer';
  public description: string = 'Requires that you have 5 heat production';
  public getScore(player: Player): number {
    return player.getProduction(Resources.HEAT);
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
