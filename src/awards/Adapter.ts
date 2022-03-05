import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../common/cards/CardType';

export class Adapter implements IAward {
  public name: string = 'Adapter';
  public description: string = 'Most cards in play with requirements (event cards do not count)';

  public getScore(player: Player): number {
    const validCards = player.playedCards.filter((card) => {
      const isValidCardType = card.cardType !== CardType.EVENT;
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    });

    return validCards.length;
  }
}
