import {IMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Turmoil} from '../turmoil/Turmoil';

export class Terraformer implements IMilestone {
  public readonly name = 'Terraformer';
  private terraformRating: number = 35;
  private terraformRatingTurmoil: number = 26;
  public readonly description;
  constructor() {
    this.description = 'Have a terraform rating of 35 (or 26 with Turmoil.)';
  }
  public getScore(player: IPlayer): number {
    return player.getTerraformRating();
  }
  public canClaim(player: IPlayer): boolean {
    const target = Turmoil.ifTurmoilElse(player.game, () => this.terraformRatingTurmoil, () => this.terraformRating);
    const score = this.getScore(player);
    return score >= target;
  }
}
