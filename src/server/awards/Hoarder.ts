import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Hoarder implements IAward {
  public readonly name = 'Hoarder';
  public readonly description = 'Most cards in hand';

  public getScore(player: Player): number {
    const score = player.cardsInHand.length;
    return score + getAdditionalScore(player);
  }
}
