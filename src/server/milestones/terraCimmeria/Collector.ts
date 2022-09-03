import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Collector implements IMilestone {
  public readonly name = 'Collector';
  public readonly description = 'Have 3 sets of automated, active and event cards';

  public getScore(player: Player): number {
    const numAutomatedCards = player.playedCards.filter((card) => card.cardType === CardType.AUTOMATED).length;
    const numActiveCards = player.playedCards.filter((card) => card.cardType === CardType.ACTIVE).length;
    const numEventCards = player.getPlayedEventsCount();

    return Math.min(numAutomatedCards, numActiveCards, numEventCards);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
