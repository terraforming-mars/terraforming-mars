
import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';

export class Magnate implements IAward {
  public readonly name = 'Magnate';
  public readonly description = 'Play the most automated cards (green cards)';
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.AUTOMATED).length;
  }
}
