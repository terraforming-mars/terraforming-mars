import {IMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Minimalist implements IMilestone {
  public readonly name = 'Minimalist';
  public readonly description = 'Have no more than 2 cards in hand';

  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }

  public canClaim(player: IPlayer): boolean {
    return this.getScore(player) <= 2;
  }
}
