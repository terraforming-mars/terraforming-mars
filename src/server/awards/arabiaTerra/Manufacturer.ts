import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';

export class AManufacturer implements IAward {
  public readonly name = 'A. Manufacturer';
  public readonly description = 'Have the most active (blue) project cards in play';
  public getScore(player: IPlayer): number {
    return player.playedCards.filter((card) => card.type === CardType.ACTIVE).length;
  }
}
