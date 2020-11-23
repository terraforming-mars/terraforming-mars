import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Resources} from '../Resources';

export class Specialist implements IMilestone {
    public name: string = 'Specialist';
    public description: string = 'Requires that you have at least 10 in production of any resource'
    public getScore(player: Player): number {
      return Math.max(player.getProduction(Resources.MEGACREDITS),
        player.getProduction(Resources.STEEL),
        player.getProduction(Resources.TITANIUM),
        player.getProduction(Resources.PLANTS),
        player.getProduction(Resources.ENERGY),
        player.getProduction(Resources.HEAT));
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) > 9;
    }
}
