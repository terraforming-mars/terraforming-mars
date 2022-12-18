import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IAward, getAdditionalScore} from '../IAward';

export class Economizer2 implements IAward {
  public readonly name = 'T. Economizer';
  public readonly description = 'Most cards in play costing 10 M€ or less';

  public getScore(player: Player): number {
    const validCardTypes = [CardType.ACTIVE, CardType.AUTOMATED];
    const score = player.playedCards.filter((card) => (card.cost <= 10) && validCardTypes.includes(card.cardType)).length;
    return score + getAdditionalScore(player); 
  }
}
