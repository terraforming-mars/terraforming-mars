import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../cards/CardType';

export class Celebrity implements IAward {
    public name: string = 'Celebrity';
    public description: string = 'Most cards in play (not events) with a cost of at least 20 megacredits'
    public getScore(player: Player): number {
      return player.playedCards
        .filter((card) => (card.cost >= 20) && (card.cardType === CardType.ACTIVE || card.cardType === CardType.AUTOMATED)).length;
    }
}
