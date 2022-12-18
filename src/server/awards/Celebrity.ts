import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../cards/IProjectCard';

export class Celebrity implements IAward {
  public readonly name = 'Celebrity';
  public readonly description = 'Most cards in play (not events) with a cost of at least 20 megacredits';
  public getScore(player: Player): number {
    const isActiveOrAutomated = (card: IProjectCard) => (
      card.cardType === CardType.ACTIVE || 
      card.cardType === CardType.AUTOMATED
    );
    const score = player.playedCards.filter(
      (card) => (card.cost >= 20) && isActiveOrAutomated(card)
    ).length;
    return score + getAdditionalScore(player);
  }
}
