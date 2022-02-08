import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../common/cards/CardType';

export class Manufacturer implements IAward {
  public name: string = 'Manufacturer';
  public description: string = 'Having the most active (blue) cards in play';
  public getScore(player: Player): number {
    return player.playedCards.filter((card) => card.cardType === CardType.ACTIVE).length;
  }
}
