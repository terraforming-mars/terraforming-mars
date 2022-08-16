import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Minimalist implements IMilestone {
  public name: string = 'Minimalist';
  public description: string = 'Have 2 or less cards in hand';

  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) <= 2;
  }
}
