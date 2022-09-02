import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Turmoil} from '../turmoil/Turmoil';

export class Terraformer implements IMilestone {
  public readonly name = 'Terraformer';
  private terraformRating: number = 35;
  private terraformRatingTurmoil: number = 26;
  public readonly description;
  constructor() {
    this.description = 'Having a terraform rating of at least ' +
                            this.terraformRating + ' or ' +
                            this.terraformRatingTurmoil + ' with Turmoil.';
  }
  public getScore(player: Player): number {
    return player.getTerraformRating();
  }
  public canClaim(player: Player): boolean {
    const target = Turmoil.ifTurmoilElse(player.game, () => this.terraformRatingTurmoil, () => this.terraformRating);
    const score = this.getScore(player);
    return score >= target;
  }
}
