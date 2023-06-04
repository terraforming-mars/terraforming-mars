import {IMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Player} from '../../Player';

export class Minimalist implements IMilestone {
  public readonly name = 'Minimalist';
  public readonly description = 'Have no more than 2 cards in hand';

  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) <= 2;
  }
}
