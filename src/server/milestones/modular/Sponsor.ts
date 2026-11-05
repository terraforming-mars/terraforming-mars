import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';


export class Sponsor extends BaseMilestone {
  public readonly automaDescription = '3+ cards costing 20+ M€ in played pile (including events)';
  constructor() {
    super(
      'Sponsor',
      'Have 3 cards that have cost of 20 M€ or more',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.playedCards.projects()
      .filter((card) => (card.cost >= 20) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED)).length;
  }

  /** MarsBot needs 3 cards costing 20 M€ or more in its played pile, events too (rulebook C p.14). */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.playedProjectCards.filter((card) => card.cost >= 20).length >= 3;
  }
}
