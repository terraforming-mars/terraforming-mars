import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone';

export class Collector extends BaseMilestone {
  constructor() {
    super(
      'Collector',
      'Have 3 sets of automated, active and event cards',
      3);
  }

  public getScore(player: Player): number {
    const numAutomatedCards = player.playedCards.filter((card) => card.type === CardType.AUTOMATED).length;
    const numActiveCards = player.playedCards.filter((card) => card.type === CardType.ACTIVE).length;
    const numEventCards = player.getPlayedEventsCount();

    return Math.min(numAutomatedCards, numActiveCards, numEventCards);
  }
}
