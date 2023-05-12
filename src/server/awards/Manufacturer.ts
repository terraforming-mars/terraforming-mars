import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Manufacturer implements IAward {
  public readonly name = 'Manufacturer';
  public readonly description = 'Have the most active (blue) cards';
  public getScore(player: Player): number {
    return player.playedCards.filter((card) => card.type === CardType.ACTIVE).length;
  }
}
