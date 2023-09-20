import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Economizer2 implements IAward {
  public readonly name = 'T. Economizer';
  public readonly description = 'Have the most project cards in play with a base cost of 10 M€ or less (not events.)';

  public getScore(player: IPlayer): number {
    const validCardTypes = [CardType.ACTIVE, CardType.AUTOMATED];
    return player.playedCards
      .filter((card) => (card.cost <= 10) && validCardTypes.includes(card.type)).length;
  }
}
