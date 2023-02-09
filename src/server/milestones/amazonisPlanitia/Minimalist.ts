import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Minimalist implements IMilestone {
  public readonly name = 'Minimalist';
  public readonly description = 'Have 2 or less cards in hand';

  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) <= 2;
  }
}
