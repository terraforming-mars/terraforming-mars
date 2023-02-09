import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Coordinator implements IAward {
  public readonly name = 'Coordinator';
  public readonly description = 'Having the most event cards in play';
  public getScore(player: Player): number {
    return player.getCardsByCardType(CardType.EVENT).length;
  }
}
