import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Energizer implements IMilestone {
  public readonly name = 'Energizer';
  public readonly description = 'Requires that you have 6 energy production';
  public getScore(player: Player): number {
    return player.production.energy;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
