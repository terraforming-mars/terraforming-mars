import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Economizer implements IMilestone {
  public readonly name = 'Economizer';
  public readonly description = 'Requires that you have 5 heat production';
  public getScore(player: Player): number {
    return player.production.heat;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
