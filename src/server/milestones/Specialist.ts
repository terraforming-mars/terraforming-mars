import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Specialist implements IMilestone {
  public readonly name = 'Specialist';
  public readonly description = 'Requires that you have at least 10 in production of any resource';
  public getScore(player: Player): number {
    return Math.max(player.production.megacredits,
      player.production.steel,
      player.production.titanium,
      player.production.plants,
      player.production.energy,
      player.production.heat);
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) > 9;
  }
}
