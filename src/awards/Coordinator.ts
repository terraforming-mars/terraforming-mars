import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../cards/CardType';

export class Coordinator implements IAward {
    public name: string = 'Coordinator';
    public description: string = 'Having the most event cards in play'
    public getScore(player: Player): number {
      return player.getCardsByCardType(CardType.EVENT).length;
    }
}
