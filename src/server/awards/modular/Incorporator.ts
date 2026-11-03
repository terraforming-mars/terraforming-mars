import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';

export class Incorporator implements IAward {
  public readonly name = 'Incorporator';
  public readonly description = 'Have the most project cards in play with a base cost of at most 10 M€ (not events.)';
  public readonly automaDescription = 'Cards costing 10 M€ or less (including events)';
  public getScore(player: IPlayer): number {
    return player.playedCards.projects().filter((card) => {
      return (card.cost <= 10) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED);
    }).length;
  }
}
