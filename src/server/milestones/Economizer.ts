import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Economizer implements IMilestone {
  public name: string = 'Economizer';
  public description: string = 'Requires that you have 5 heat production';
  public getScore(player: Player): number {
    return player.production.heat;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
