import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Adapter implements IAward {
  public readonly name = 'Adapter';
  public readonly description = 'Most cards in play with requirements';

  public getScore(player: Player): number {
    const score = player.playedCards.filter((card) => {
      const isValidCardType = card.cardType !== CardType.EVENT;
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    }).length;

    return score + getAdditionalScore(player);
  }
}
