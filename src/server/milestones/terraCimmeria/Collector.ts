import {CardType} from '../../../common/cards/CardType';
import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Collector extends BaseMilestone {
  constructor() {
    super(
      'T. Collector',
      'Have 3 sets of automated (green), active (blue) and event (red) project cards in play',
      3);
  }

  public getScore(player: IPlayer): number {
    const numAutomatedCards = player.playedCards.filter((card) => card.type === CardType.AUTOMATED).length;
    const numActiveCards = player.playedCards.filter((card) => card.type === CardType.ACTIVE).length;
    const numEventCards = player.getPlayedEventsCount();

    return Math.min(numAutomatedCards, numActiveCards, numEventCards);
  }
}
