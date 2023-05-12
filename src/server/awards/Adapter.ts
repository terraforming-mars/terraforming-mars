import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Adapter implements IAward {
  public readonly name = 'Adapter';
  public readonly description = 'Play the most cards with requirements';

  public getScore(player: Player): number {
    const validCards = player.playedCards.filter((card) => {
      const isValidCardType = card.type !== CardType.EVENT;
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    });

    return validCards.length;
  }
}
