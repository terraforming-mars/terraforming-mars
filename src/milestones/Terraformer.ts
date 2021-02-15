import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Terraformer implements IMilestone {
    public name: string = 'Terraformer';
    public description: string;

    constructor(private terraformRating: number = 35) {
      this.description = 'Having a terraform rating of at least ' + terraformRating;
    }
    public getScore(player: Player): number {
      return player.getTerraformRating();
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) >= this.terraformRating;
    }
}
