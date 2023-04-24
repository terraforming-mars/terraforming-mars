import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Tactician extends BaseMilestone {
  constructor() {
    super(
      'Tactician',
      'Requires that you have 5 cards with requirements in play',
      5);
  }
  private excludedCardTypes = [CardType.PRELUDE, CardType.EVENT];

  public getScore(player: Player): number {
    const validCards = player.playedCards.filter((card) => {
      const isValidCardType = !this.excludedCardTypes.includes(card.type);
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    });

    return validCards.length;
  }
}
