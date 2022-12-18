
import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Magnate implements IAward {
  public readonly name = 'Magnate';
  public readonly description = 'Most automated cards in play (green cards)';
  public getScore(player: Player): number {
    const score = player.playedCards
      .filter((card) => card.cardType === CardType.AUTOMATED).length;
    return score + getAdditionalScore(player);
  }
}
