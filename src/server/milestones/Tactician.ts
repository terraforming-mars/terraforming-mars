import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Tactician implements IMilestone {
  public readonly name = 'Tactician';
  public readonly description = 'Requires that you have 5 cards with requirements in play';
  private excludedCardTypes = [CardType.PRELUDE, CardType.EVENT];

  public getScore(player: Player): number {
    const validCards = player.playedCards.filter((card) => {
      const isValidCardType = !this.excludedCardTypes.includes(card.cardType);
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    });

    return validCards.length;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
