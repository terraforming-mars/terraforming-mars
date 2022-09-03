import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Economizer implements IAward {
  public readonly name = 'T. Economizer';
  public readonly description = 'Most cards in play costing 10 M€ or less';

  public getScore(player: Player): number {
    const validCardTypes = [CardType.ACTIVE, CardType.AUTOMATED];
    return player.playedCards
      .filter((card) => (card.cost <= 10) && validCardTypes.includes(card.cardType)).length;
  }
}
