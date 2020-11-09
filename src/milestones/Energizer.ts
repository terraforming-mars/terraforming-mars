import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Resources} from '../Resources';

export class Energizer implements IMilestone {
    public name: string = 'Energizer';
    public description: string = 'Requires that you have 6 energy production'
    public getScore(player: Player): number {
      return player.getProduction(Resources.ENERGY);
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) >= 6;
    }
}
