import {IMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Terraformer implements IMilestone {
  public readonly name = 'Terraformer';
  private terraformRating: number = 35;
  private terraformRatingTurmoil: number = 26;
  public readonly description;
  public readonly automaDescription = 'TR ≥ 35';
  constructor() {
    this.description = 'Have a terraform rating of 35 (or 26 with Turmoil.)';
  }
  public getScore(player: IPlayer): number {
    return player.terraformRating;
  }
  private target(player: IPlayer): number {
    return player.game.turmoil ? this.terraformRatingTurmoil : this.terraformRating;
  }
  public canClaim(player: IPlayer): boolean {
    return this.getScore(player) >= this.target(player);
  }
  public remaining(player: IPlayer): number {
    return Math.max(0, this.target(player) - this.getScore(player));
  }
}
